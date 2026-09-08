import crypto from 'crypto';
import QRCode from 'qrcode';

export interface LotPassportData {
  lotNumber: string;
  creatorName: string;
  creatorRole: string;
  commodityNameEn: string;
  commodityNameMr: string;
  quantityQuintals: number;
  moisturePercent: number;
  visualGrade: string;
  harvestDate: string | Date;
  storageLocation: string;
  district: string;
  issuedAt: string;
}

export function generateLotPassportHash(data: LotPassportData): string {
  const payload = [
    data.lotNumber,
    data.creatorName,
    data.commodityNameEn,
    data.quantityQuintals,
    data.moisturePercent,
    data.visualGrade,
    data.district,
    data.harvestDate,
    'MAHARASHTRA_AGRI_PASSPORT_AUTHENTICITY_ROOT'
  ].join('::');

  return crypto.createHash('sha256').update(payload).digest('hex');
}

export async function generateLotQRCodeDataUrl(lotId: string, lotNumber: string, hash: string): Promise<string> {
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/farmer/lots/${lotId}/passport?verify=true&hash=${hash.slice(0, 16)}`;
  try {
    const qrDataUrl = await QRCode.toDataURL(verificationUrl, {
      width: 280,
      margin: 2,
      color: {
        dark: '#15803d', // Agri green
        light: '#ffffff'
      }
    });
    return qrDataUrl;
  } catch (err) {
    console.error('Failed to generate QR Code:', err);
    return '';
  }
}
