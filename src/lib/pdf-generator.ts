import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { RowInput } from 'jspdf-autotable';
import { CartItem } from '@/lib/store/cart';
import type { Order, Product, Variant } from '@/types/db';

type JsPDFWithPlugin = jsPDF & { lastAutoTable?: { finalY: number } };

export const generateQuotePDF = (items: CartItem[], customerDetails: Order['customer_details'], quoteId: string) => {
  const doc: JsPDFWithPlugin = new jsPDF();

  // Header
  doc.setFontSize(22);
  doc.setTextColor(0, 85, 170); // Medical Blue
  doc.text('PRESTIGE MEDICAL', 20, 20);
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text('Route Manzel Chaker km 0.5, Avenue Fardaws, Sfax 3000', 20, 26);
  doc.text('Tel: +216 56 890 908 / +216 28 307 273', 20, 31);
  doc.text('Email: presmed.sfax@gmail.com', 20, 36);

  // Quote Info
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`Quote #: ${quoteId}`, 140, 20);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 140, 26);
  
  // Customer Details
  doc.setDrawColor(200, 200, 200);
  doc.line(20, 45, 190, 45);
  
  doc.setFontSize(11);
  doc.text('Bill To:', 20, 55);
  doc.setFontSize(10);
  doc.text(customerDetails.name, 20, 61);
  doc.text(customerDetails.phone, 20, 66);
  doc.text(customerDetails.address || '', 20, 71);

  // Items Table
  const tableData = items.map(item => [
    item.name,
    item.variantName,
    item.id,
    item.quantity,
    item.price.toFixed(3),
    (item.price * item.quantity).toFixed(3)
  ]);

  autoTable(doc, {
    startY: 80,
    head: [['Product', 'Variant', 'SKU', 'Qty', 'Unit Price', 'Total']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [0, 85, 170] },
    columnStyles: {
      4: { halign: 'right' },
      5: { halign: 'right' }
    }
  });

  // Total
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const finalY = (doc.lastAutoTable?.finalY ?? 80) + 10;
  
  doc.setFontSize(12);
  doc.text(`Total: ${total.toFixed(3)} TND`, 140, finalY);

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text('This quote is valid for 15 days. Prices include VAT.', 20, 280);

  return doc;
};

export const generateDatasheetPDF = (product: Product, variant: Variant) => {
  const doc: JsPDFWithPlugin = new jsPDF();

  // Header
  doc.setFontSize(22);
  doc.setTextColor(0, 85, 170);
  doc.text('PRESTIGE MEDICAL', 20, 20);
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text('Route Manzel Chaker km 0.5, Avenue Fardaws, Sfax 3000', 20, 26);
  doc.text('Tel: +216 56 890 908 / +216 28 307 273', 20, 31);
  doc.text('Email: presmed.sfax@gmail.com', 20, 36);

  // Title
  doc.setFontSize(18);
  doc.setTextColor(0, 0, 0);
  doc.text('FICHE TECHNIQUE', 105, 50, { align: 'center' });

  // Product Name
  doc.setFontSize(16);
  doc.setTextColor(0, 85, 170);
  const name = typeof product.name === 'string' ? product.name : (product.name?.fr || product.name?.en || 'Produit');
  doc.text(name, 20, 70);

  // Description
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  const description = typeof product.description === 'string' ? product.description : (product.description?.fr || product.description?.en || '');
  const desc = doc.splitTextToSize(description, 170);
  doc.text(desc, 20, 80);

  let yPos = 80 + (desc.length * 5) + 10;

  // Specs
  doc.setFontSize(12);
  doc.setTextColor(0, 85, 170);
  doc.text('Spécifications Techniques', 20, yPos);
  yPos += 10;

  const specs: RowInput[] = product.technical_specs 
    ? (Object.entries(product.technical_specs) as Array<[string, string]>).map(([key, value]) => [key, value])
    : [];
  
  if (specs.length > 0) {
    autoTable(doc, {
      startY: yPos,
      head: [['Caractéristique', 'Valeur']],
      body: specs,
      theme: 'grid',
      headStyles: { fillColor: [0, 85, 170] }
    });
    yPos = ((doc.lastAutoTable?.finalY ?? yPos) + 20);
  } else {
    yPos += 10;
  }

  // Footer / Certification
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text('Qualité Certifiée:', 20, yPos);
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text('Nous distribuons exclusivement des équipements médicaux certifiés ISO & CE.', 20, yPos + 5);
  doc.text('Garantie constructeur et service après-vente assuré à Sfax.', 20, yPos + 10);

  doc.save(`fiche-technique-${product.brand || 'product'}-${variant?.sku || 'sku'}.pdf`);
};
