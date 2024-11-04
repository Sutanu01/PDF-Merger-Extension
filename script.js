const fileInput1 = document.getElementById("fileInput1");
const fileInput2 = document.getElementById("fileInput2");
const text1 = document.querySelector(".t1");
const text2 = document.querySelector(".t2");
const img1 = document.querySelector('.img1');
const img2 = document.querySelector('.img2');
const merger = document.querySelector('.merger');

fileInput1.addEventListener("change", function() {
    if (fileInput1.files.length > 0) {
        img1.style.display = 'block';
        text1.innerHTML = (fileInput1.files[0].name).slice(0, 7) + ((fileInput1.files[0].name.length > 12) ? "..." : "");
    }
});

fileInput2.addEventListener("change", function() {
    if (fileInput2.files.length > 0) {
        img2.style.display = 'block';
        text2.innerHTML = (fileInput2.files[0].name).slice(0, 7) + ((fileInput2.files[0].name.length > 12) ? "..." : "");
    }
});

merger.addEventListener('click', async () => {
    if (fileInput1.files.length === 0 || fileInput2.files.length === 0) {
        alert("Choose PDF files to merge");
        return;
    }

    try {
        const pdf1File = fileInput1.files[0];
        const pdf2File = fileInput2.files[0];
        const pdf1Bytes = await readFileAsArrayBuffer(pdf1File);
        const pdf2Bytes = await readFileAsArrayBuffer(pdf2File);

        const pdfDoc = await PDFLib.PDFDocument.create(); 
        const pdf1Doc = await PDFLib.PDFDocument.load(pdf1Bytes);
        const pdf2Doc = await PDFLib.PDFDocument.load(pdf2Bytes);

        const copiedPages1 = await pdfDoc.copyPages(pdf1Doc, pdf1Doc.getPageIndices());
        const copiedPages2 = await pdfDoc.copyPages(pdf2Doc, pdf2Doc.getPageIndices());

        copiedPages1.forEach((page) => pdfDoc.addPage(page));
        copiedPages2.forEach((page) => pdfDoc.addPage(page));

        const mergedPdfBytes = await pdfDoc.save();

        const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
        const link = document.getElementById('downloadLink');
        link.href = URL.createObjectURL(blob);
        link.style.display = 'block';
    } catch (error) {
        console.error("Error merging PDFs:", error);
    }
});

function readFileAsArrayBuffer(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });
}
