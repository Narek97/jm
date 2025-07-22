import JSZip from 'jszip';

import { FILE_TYPE_CONFIG, SIGNATURE_TO_EXTENSION } from '@/Constants';
import { FileTypeEnum } from '@/types/enum';

const getFileSignature = (file: File): Promise<{ signature: string; riffSubtype?: string }> => {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = () => {
      const arr = new Uint8Array(reader.result as ArrayBuffer);
      const signature = Array.from(arr.slice(0, 4))
        .map(byte => byte.toString(16).padStart(2, '0'))
        .join('')
        .toUpperCase();

      let riffSubtype: string | undefined;
      if (signature === '52494646' && arr.length >= 12) {
        riffSubtype = String.fromCharCode(...arr.slice(8, 12));
      }

      resolve({ signature, riffSubtype });
    };

    reader.readAsArrayBuffer(file.slice(0, 12));
  });
};

const getExtensionFromSignature = (
  signature: string,
  map: Record<string, string>,
  riffSubtype?: string,
): string | undefined => {
  if (signature === '52494646') {
    if (riffSubtype === 'AVI ') return 'avi';
    return undefined;
  }

  if (!map[signature] && signature === '504B0304') {
    return undefined;
  }

  return Object.entries(map).find(([sig]) => signature.startsWith(sig))?.[1];
};

const getFileExtensionFromZip = async (file: File): Promise<string | undefined> => {
  const arrayBuffer = await file.arrayBuffer();
  const zip = await JSZip.loadAsync(arrayBuffer);

  const files = Object.keys(zip.files);

  if (files.some(name => name.startsWith('word/'))) return 'docx';
  if (files.some(name => name.startsWith('ppt/'))) return 'pptx';
  if (files.some(name => name.startsWith('xl/'))) return 'xlsx';

  return undefined;
};

export const validateFile = async (
  file: File,
  fileType: FileTypeEnum,
): Promise<{ valid: boolean; extension?: string; allowedExtensions: string[] }> => {
  const { extensions: allowedExtensions } = FILE_TYPE_CONFIG[fileType];
  const allowedSignatureMap = SIGNATURE_TO_EXTENSION[fileType];

  let extension = file.name.includes('.') ? file.name.split('.').pop()?.toLowerCase() : undefined;

  if (extension && allowedExtensions.includes(extension)) {
    return { valid: true, extension, allowedExtensions };
  }

  const { signature, riffSubtype } = await getFileSignature(file);
  extension = getExtensionFromSignature(signature, allowedSignatureMap, riffSubtype);

  if (signature === '504B0304') {
    const officeExt = await getFileExtensionFromZip(file);
    if (officeExt && allowedExtensions.includes(officeExt)) {
      extension = officeExt;
    }
  }

  const isValid = !!extension && allowedExtensions.includes(extension);
  return { valid: isValid, extension, allowedExtensions };
};
