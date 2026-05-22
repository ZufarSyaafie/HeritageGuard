import { create } from 'zustand';

const useScanStore = create((set) => ({
  scanStatus: 'idle',
  imageFile: null,
  imagePreview: null,
  detections: [],
  assetMeta: {
    buildingName: '',
    location: '',
    inspectedAt: '',
  },
  errorMsg: null,

  setImage: (file, preview) => set({ imageFile: file, imagePreview: preview }),
  setMeta: (meta) => set({ assetMeta: meta }),
  startScan: () => set({ scanStatus: 'uploading', errorMsg: null, detections: [] }),
  setScanSuccess: (detections) => set({ scanStatus: 'success', detections }),
  setScanError: (msg) => set({ scanStatus: 'error', errorMsg: msg }),
  resetScan: () => set({
    scanStatus: 'idle',
    imageFile: null,
    imagePreview: null,
    detections: [],
    assetMeta: { buildingName: '', location: '', inspectedAt: '' },
    errorMsg: null,
  }),
}));

export default useScanStore;
