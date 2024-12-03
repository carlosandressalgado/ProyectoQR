import { Injectable } from '@angular/core';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { CapacitorBarcodeScanner, CapacitorBarcodeScannerTypeHint } from '@capacitor/barcode-scanner';

@Injectable({
  providedIn: 'root',
})
export class QrScannerService {
  private barcodeScannerSupported: boolean = false;

  constructor() {}

  async init(): Promise<void> {
    try {
      const result = await BarcodeScanner.isSupported();
      this.barcodeScannerSupported = result.supported;
    } catch (e) {
      console.error('Error al verificar soporte del escáner', e);
    }
  }

  async scan(): Promise<string[]> {
    if (this.barcodeScannerSupported) {
      if (await this.requestPermissions()) {
        const { barcodes } = await BarcodeScanner.scan();
        return barcodes.map((barcode) => barcode.rawValue);
      } else {
        return [];
      }
    } else {
      const result = await CapacitorBarcodeScanner.scanBarcode({
        hint: CapacitorBarcodeScannerTypeHint.ALL,
      });
      return [result.ScanResult];
    }
  }

  public async requestPermissions(): Promise<boolean> {
    const { camera } = await BarcodeScanner.requestPermissions();
    return camera === 'granted' || camera === 'limited';
  }
}