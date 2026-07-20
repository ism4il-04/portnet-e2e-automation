import type { FrameLocator, Page } from '@playwright/test';
import { APP_URLS } from '../constants/urls.js';

export type ModelDescriptionData = {
  otherDesignation: string;
  fabricant: string;
  marque: string;
  modele: string;
  usageDescription: string;
};

export type RevisionWithInitialCertificateData = {
  otherDesignation: string;
  fabricant: string;
  marque: string;
  modele: string;
  usageDescription: string;
  certificateRowName: string;
};

export type RevisionWithOtherCertificateData = {
  otherDesignation: string;
  fabricant: string;
  marque: string;
  modele: string;
  usageDescription: string;
  otherCertificateNumber: string;
};

export type RenouvellementWithInitialCertificateData = RevisionWithInitialCertificateData;

export type RenouvellementWithOtherCertificateData = RevisionWithOtherCertificateData;

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

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
  private hasHandledContinuerPopup = false;

  constructor(page: Page) {
    this.page = page;
  }

  private get appFrame(): FrameLocator {
    return this.page.locator('#iframe').contentFrame();
  }

  private get tarificationOverlay() {
    return this.page.locator('[id$="alertaTarificationExercicePanelDiv"]');
  }

  private async handleDelayedContinuerPopup(): Promise<void> {
    if (this.hasHandledContinuerPopup) {
      return;
    }

    const continueButton = this.page.getByRole('button', { name: 'Continuer' }).first();

    // This popup can appear a few seconds after home redirect.
    if (await this.tarificationOverlay.isVisible().catch(() => false)) {
      if (await continueButton.isVisible().catch(() => false)) {
        await continueButton.click({ noWaitAfter: true });
      }
      this.hasHandledContinuerPopup = true;
    } else {
      try {
        await continueButton.waitFor({ state: 'visible', timeout: 3500 });
        await continueButton.click({ noWaitAfter: true });
        this.hasHandledContinuerPopup = true;
      } catch {
        // Continue when popup does not appear in this session.
      }
    }

    // Prevent sidebar click interception by modal mask when popup is open.
    try {
      await this.tarificationOverlay.waitFor({ state: 'hidden', timeout: 10000 });
    } catch {
      // Best effort dismissal fallback.
      await this.page.keyboard.press('Escape').catch(() => undefined);
      await this.tarificationOverlay.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => undefined);
    }
  }

  async continueFromHome(): Promise<void> {
    if (!APP_URLS.home) {
      throw new Error('HOME_URL is not configured. Set HOME_URL in your local .env or CI secret.');
    }

    if (!this.page.url().startsWith(APP_URLS.home)) {
      await this.page.goto(APP_URLS.home, { waitUntil: 'domcontentloaded' });
    }

    await this.handleDelayedContinuerPopup();

    try {
      await this.page.locator('#iframe').waitFor({ state: 'visible', timeout: 5000 });
    } catch {
      // Some sessions render iframe only after sidebar navigation; continue without hard failure.
    }
  }

  async openDemandeApprobationFromSidebar(): Promise<void> {
    await this.handleDelayedContinuerPopup();

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

  async fillRevisionWithInitialCertificate(data: RevisionWithInitialCertificateData): Promise<void> {
    await this.fillModelDescriptionForNature('Révision', data);
    await this.selectInitialCertificateRow(data.certificateRowName);
    await this.appFrame.getByRole('button', { name: 'Suivant' }).click();
  }

  async fillRevisionWithOtherCertificate(data: RevisionWithOtherCertificateData): Promise<void> {
    await this.fillModelDescriptionForNature('Révision', data);
    await this.appFrame.getByRole('textbox', { name: /Autre N° de certificat initial/i }).fill(data.otherCertificateNumber);
    await this.appFrame.getByRole('button', { name: 'Suivant' }).click();
  }

  async fillRenouvellementWithInitialCertificate(data: RenouvellementWithInitialCertificateData): Promise<void> {
    await this.fillModelDescriptionForNature('Renouvellement', data);
    await this.selectInitialCertificateRow(data.certificateRowName);
    await this.appFrame.getByRole('button', { name: 'Suivant' }).click();
  }

  async fillRenouvellementWithOtherCertificate(data: RenouvellementWithOtherCertificateData): Promise<void> {
    await this.fillModelDescriptionForNature('Renouvellement', data);
    await this.appFrame.getByRole('textbox', { name: /Autre N° de certificat initial/i }).fill(data.otherCertificateNumber);
    await this.appFrame.getByRole('button', { name: 'Suivant' }).click();
  }

  private async fillModelDescriptionForNature(
    nature: 'Révision' | 'Renouvellement',
    data: { otherDesignation: string; fabricant: string; marque: string; modele: string; usageDescription: string }
  ): Promise<void> {
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

    await this.appFrame.getByRole('button', { name: /Nature de la demande/i }).click();
    await this.appFrame.getByRole('option', { name: nature }).click();
  }

  private async selectInitialCertificateRow(certificateRowName: string): Promise<void> {
    await this.appFrame.getByRole('textbox', { name: 'N° de certificat initial', exact: true }).click();
    const certificateRowButton = this.appFrame
      .getByRole('row', { name: new RegExp(escapeRegExp(certificateRowName), 'i') })
      .getByRole('button')
      .first();

    if (await certificateRowButton.count()) {
      await certificateRowButton.click();
    } else {
      await this.appFrame.getByRole('row').getByRole('button').first().click();
    }
  }

  private async uploadByTextboxLabel(label: RegExp, filePath: string): Promise<void> {
    const textbox = this.appFrame.getByRole('textbox', { name: label }).first();
    if ((await textbox.count()) === 0) {
      console.log('[Upload] Field not found, skipping:', label);
      return;
    }

    const selectButton = textbox
      .locator('xpath=ancestor::*[.//button[normalize-space()="Sélectionner"]][1]')
      .getByRole('button', { name: 'Sélectionner' })
      .first();

    if ((await selectButton.count()) === 0) {
      console.log('[Upload] Selection button not found for field, skipping:', label);
      return;
    }

    await Promise.all([
      this.page.waitForEvent('filechooser', { timeout: 10000 }).then((chooser) => chooser.setFiles(filePath)),
      selectButton.click()
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
