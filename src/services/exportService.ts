import { COPControle } from '../types';

export const exportService = {
  // Export as CSV with UTF-8 BOM for Excel compatibility
  exportToCSV: (controles: COPControle[], filename = 'export_cop_ftth.csv') => {
    if (controles.length === 0) {
      alert('Aucune donnée à exporter pour les filtres sélectionnés.');
      return;
    }

    const headers = [
      'Date Controle',
      'N° Dossier',
      'Client',
      'Prestataire',
      'Localité',
      'GPS Client',
      'Conforme',
      'COP Status',
      'Non-conformités',
      'Gravité',
      'Commentaire',
      'Responsable Action',
      'Technicien COP',
    ];

    const rows = controles.map((c) => [
      `"${c.dateControle}"`,
      `"${c.numeroDossier.replace(/"/g, '""')}"`,
      `"${c.nomClient.replace(/"/g, '""')}"`,
      `"${c.prestataire.replace(/"/g, '""')}"`,
      `"${c.localite.replace(/"/g, '""')}"`,
      `"${c.gpsClient.replace(/"/g, '""')}"`,
      `"${c.conforme ? 'OUI' : 'NON'}"`,
      `"${c.cop}"`,
      `"${c.nonConformites.join('; ').replace(/"/g, '""')}"`,
      `"${c.gravite}"`,
      `"${(c.commentaire || '').replace(/"/g, '""')}"`,
      `"${(c.responsableAction || '').replace(/"/g, '""')}"`,
      `"${c.technicien.replace(/"/g, '""')}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map((e) => e.join(';'))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  // Export as XLSX using global XLSX library or dynamic download
  exportToExcel: (controles: COPControle[], filename = 'export_cop_ftth.xlsx') => {
    if (controles.length === 0) {
      alert('Aucune donnée à exporter pour les filtres sélectionnés.');
      return;
    }

    const formattedData = controles.map((c) => ({
      'Date Contrôle': c.dateControle,
      'N° Dossier / Ligne': c.numeroDossier,
      'Client': c.nomClient,
      'Prestataire': c.prestataire,
      'Localité': c.localite,
      'GPS Client': c.gpsClient,
      'Conforme': c.conforme ? 'OUI' : 'NON',
      'COP Status': c.cop,
      'Type de Non-conformité': c.nonConformites.join(', '),
      'Gravité': c.gravite,
      'Commentaire': c.commentaire,
      'Responsable Action': c.responsableAction,
      'Technicien COP': c.technicien,
    }));

    // If XLSX library is present in window (CDN or bundle)
    if ((window as any).XLSX) {
      const XLSX = (window as any).XLSX;
      const worksheet = XLSX.utils.json_to_sheet(formattedData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Contrôles COP');
      XLSX.writeFile(workbook, filename);
    } else {
      // Fallback to CSV format if XLSX script is still loading
      exportService.exportToCSV(controles, filename.replace('.xlsx', '.csv'));
    }
  },

  // Export to PDF report
  exportToPDF: (controles: COPControle[], filename = 'rapport_cop_ftth.pdf') => {
    if (controles.length === 0) {
      alert('Aucune donnée à exporter pour les filtres sélectionnés.');
      return;
    }

    if ((window as any).jspdf) {
      const { jsPDF } = (window as any).jspdf;
      const doc = new jsPDF('l', 'mm', 'a4'); // Landscape A4

      // Header
      doc.setFillColor(0, 82, 204); // CELTIIS FTTH Blue
      doc.rect(0, 0, 297, 24, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('RAPPORT DE CONTRÔLE COP FTTH - CELTIIS BENIN', 14, 15);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Généré le: ${new Date().toLocaleDateString('fr-FR')} | Total: ${controles.length} dossiers`, 200, 15);

      // Table columns & rows
      const tableColumn = ['Date', 'N° Dossier', 'Client', 'Prestataire', 'Localité', 'Conforme', 'Gravité', 'Technicien'];
      const tableRows = controles.map((c) => [
        c.dateControle,
        c.numeroDossier,
        c.nomClient,
        c.prestataire,
        c.localite,
        c.conforme ? 'OK (OUI)' : 'NOK (NON)',
        c.gravite,
        c.technicien,
      ]);

      if (doc.autoTable) {
        doc.autoTable({
          head: [tableColumn],
          body: tableRows,
          startY: 30,
          theme: 'striped',
          headStyles: { fillColor: [0, 82, 204], textColor: [255, 255, 255], fontStyle: 'bold' },
          alternateRowStyles: { fillColor: [245, 247, 250] },
          styles: { fontSize: 9, cellPadding: 3 },
          columnStyles: {
            5: { fontStyle: 'bold' },
          },
          didParseCell: (data: any) => {
            if (data.section === 'body' && data.column.index === 5) {
              if (data.cell.raw.includes('NOK')) {
                data.cell.styles.textColor = [220, 38, 38]; // Red
              } else {
                data.cell.styles.textColor = [22, 163, 74]; // Green
              }
            }
          },
        });
      } else {
        // Basic fallback text rendering if autoTable is missing
        let y = 35;
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(9);
        tableRows.forEach((row, i) => {
          if (y > 190) {
            doc.addPage();
            y = 20;
          }
          doc.text(row.join('  |  '), 14, y);
          y += 7;
        });
      }

      doc.save(filename);
    } else {
      // Print window fallback
      window.print();
    }
  },
};
