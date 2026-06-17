const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = (error) => reject(error);
  });
};

export const scanReceiptWithGemini = async (file, availableCategories) => {
  if (!GEMINI_API_KEY) {
    throw new Error('⚠️ API Key Gemini belum terkonfigurasi di hosting cloud!');
  }

  const base64Data = await fileToBase64(file);
  const prompt = `Kamu adalah sistem Fin-Core AI OCR. Analisis gambar struk belanja, nota, bukti transfer, atau bukti bayar QRIS ini. Ekstrak informasi total biaya (amount), kategori yang cocok (category), dan deskripsi singkat (description). Kamu WAJIB mengembalikan jawaban HANYA berbentuk format JSON bersih tanpa bungkus markdown/backticks. Skema format JSON yang wajib diikuti: { "amount": "angka_bulat_total_tanpa_titik_atau_rupiah", "category": "Pilih teks yang paling relevan dari daftar ini: ${availableCategories.join(', ')}, atau Lainnya", "description": "Keterangan singkat barang/jasa yang dibeli, maksimal 5 kata" }`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: prompt },
            { inlineData: { mimeType: file.type, data: base64Data } }
          ]
        }],
        generationConfig: { responseMimeType: "application/json" }
      })
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Gemini API Error: ${errorData.error?.message || response.statusText}`);
  }

  const result = await response.json();
  const aiTextResult = result.candidates[0].content.parts[0].text;
  return JSON.parse(aiTextResult);
};