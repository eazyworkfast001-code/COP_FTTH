import { COPControle, COPPayloadJSON } from '../types';

export const powerAutomateService = {
  // Format COP object to the exact JSON payload specified in requirements
  formatPayload: (controle: COPControle): COPPayloadJSON => {
    return {
      numeroDossier: controle.numeroDossier,
      nomClient: controle.nomClient,
      prestataire: controle.prestataire,
      localite: controle.localite,
      gpsClient: controle.gpsClient,
      dateControle: controle.dateControle,
      technicien: controle.technicien,
      conforme: controle.conforme,
      nonConformites: controle.nonConformites,
      gravite: controle.gravite,
      commentaire: controle.commentaire,
      responsableAction: controle.responsableAction || '',
      cop: controle.cop,
    };
  },

  // Send JSON payload to Power Automate HTTP trigger endpoint
  sendToPowerAutomate: async (
    controle: COPControle,
    webhookUrl?: string
  ): Promise<{ success: boolean; message: string; payload: COPPayloadJSON }> => {
    const payload = powerAutomateService.formatPayload(controle);

    if (!webhookUrl || webhookUrl.trim() === '') {
      // Simulation mode
      console.log('Power Automate Simulation - Payload JSON:', payload);
      return {
        success: true,
        message: 'Données validées et enregistrées localement (Mode simulation Power Automate active).',
        payload,
      };
    }

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        return {
          success: true,
          message: 'Contrôle COP transmis avec succès à Power Automate & Excel Online !',
          payload,
        };
      } else {
        const errText = await response.text();
        return {
          success: false,
          message: `Erreur Power Automate (${response.status}): ${errText || response.statusText}`,
          payload,
        };
      }
    } catch (err: any) {
      console.warn('Power Automate Webhook error:', err);
      return {
        success: true, // Don't block local save on network error, inform user
        message: `Données sauvegardées localement. Avertissement réseau Power Automate: ${err.message || 'Impossible de joindre le serveur'}.`,
        payload,
      };
    }
  },
};
