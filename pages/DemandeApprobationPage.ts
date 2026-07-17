import type { FrameLocator, Page } from '@playwright/test';
import { APP_URLS } from '../constants/urls.js';

export type ModelDescriptionData = {
  otherDesignation: string;
  fabricant: string;
  marque: string;
  modele: string;
  usageDescription: string;
};

export type RequiredDocuments = {
  mandatFile: string;
  noteDescriptiveFile: string;
  drawingsFile: string;
  userDocsFile: string;
  testReportsFile: string;
  oimlCertificateFile: string;
  approvalRequestFile: string;
};

export class DemandeApprobationPage {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  private get appFrame(): FrameLocator {
    return this.page.locator('#iframe').contentFrame();
  }

  async continueFromHome(): Promise<void> {
    if (!APP_URLS.home) {
      throw new Error('HOME_URL is not configured. Set HOME_URL in your local .env or CI secret.');
    }

    await this.page.goto(APP_URLS.home);

    const continueButton = this.page.getByRole('button', { name: 'Continuer' }).first();
    if (await continueButton.count()) {
      await continueButton.click();
    }
  }

  async openDemandeApprobationFromSidebar(): Promise<void> {
    await this.page.getByRole('row', { name: /^.*Importation$/i }).first().click();
    await this.page.getByRole('row', { name: /^Importation des instruments de mesures$/i }).click();
    await this.page.getByRole('row', { name: /^Demandes d'approbation de modèle$/i }).first().click();
    await this.page.getByRole('row', { name: /^Demandes d'approbation de modèle$/i }).last().click();
  }

  async startNewDemande(): Promise<void> {
    const nouvelleDemandeButton = this.appFrame.getByRole('button', { name: 'Nouvelle Demande' });
    await nouvelleDemandeButton.waitFor({ state: 'visible', timeout: 15000 });
    await nouvelleDemandeButton.click();
    await this.appFrame.getByRole('button', { name: 'Suivant' }).click();
  }

  async fillModelDescription(data: ModelDescriptionData): Promise<void> {
    await this.appFrame.getByRole('textbox', { name: 'Catégorie de l\'IM' }).click();
    await this.appFrame.getByRole('row', { name: 'MA.2 Chronotachygraphes' }).getByRole('button').click();
    await this.appFrame.getByRole('button', { name: 'Désignation de l\'IM' }).click();
    await this.appFrame.getByRole('option', { name: 'Chronotachygraphes' }).click();

    await this.appFrame.getByRole('textbox', { name: 'Autre désignation de l\'IM' }).fill(data.otherDesignation);
    await this.appFrame.getByRole('textbox', { name: 'Pays d\'origine (de' }).click();
    await this.appFrame.getByRole('row', { name: 'SH SAINTE-HELENE Choisir' }).getByRole('button').click({ noWaitAfter: true });
    await this.appFrame.getByRole('textbox', { name: 'Fabricant' }).fill(data.fabricant);
    await this.appFrame.getByRole('textbox', { name: 'Marque' }).fill(data.marque);
    await this.appFrame.getByRole('textbox', { name: 'Modèle' }).fill(data.modele);
    await this.appFrame.getByRole('textbox', { name: 'Usage prévu (Description)' }).fill(data.usageDescription);
    await this.appFrame.getByRole('button', { name: 'Suivant' }).click();
  }

  private async uploadByTextboxLabel(label: RegExp, filePath: string): Promise<void> {
    await Promise.all([
      this.page.waitForEvent('filechooser').then((chooser) => chooser.setFiles(filePath)),
      this.appFrame
        .getByRole('textbox', { name: label })
        .locator('xpath=ancestor::*[.//button[normalize-space()="Sélectionner"]][1]')
        .getByRole('button', { name: 'Sélectionner' })
        .first()
        .click()
    ]);
  }

  async uploadRequiredDocuments(files: RequiredDocuments): Promise<void> {
    await this.uploadByTextboxLabel(/En cas d.?importateur, la/i, files.mandatFile);
    await this.uploadByTextboxLabel(/Note descriptive de l.?/i, files.noteDescriptiveFile);
    await this.uploadByTextboxLabel(/Les dessins de montage,/i, files.drawingsFile);
    await this.uploadByTextboxLabel(/Les documents destinés à l.?/i, files.userDocsFile);
    await this.uploadByTextboxLabel(/Les rapports d.?essais effectu/i, files.testReportsFile);
    await this.uploadByTextboxLabel(/Le certificat OIML, ou tout/i, files.oimlCertificateFile);
    await this.uploadByTextboxLabel(/Une demande d.?approbation de/i, files.approvalRequestFile);
  }

  async logPotentialEmptyVisibleFields(): Promise<void> {
    const emptyVisibleFields = await this.appFrame
      .locator('input[type="text"], textarea')
      .evaluateAll((nodes) => {
        const results: string[] = [];

        for (const node of nodes) {
          const element = node as HTMLInputElement | HTMLTextAreaElement;
          const style = window.getComputedStyle(element);
          const rect = element.getBoundingClientRect();
          const isVisible = style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;

          if (!isVisible || element.disabled || element.readOnly) {
            continue;
          }

          if ((element.value || '').trim() !== '') {
            continue;
          }

          const label =
            element.getAttribute('aria-label') ||
            element.getAttribute('name') ||
            element.getAttribute('placeholder') ||
            element.id ||
            '<unknown field>';

          results.push(label);
        }

        return Array.from(new Set(results));
      });

    if (emptyVisibleFields.length > 0) {
      console.log('[Pre-submit] Potential empty visible fields:', emptyVisibleFields);
    }
  }

  async submit(): Promise<void> {
    await this.appFrame.getByRole('button', { name: 'Enregistrer' }).click();
  }
}
