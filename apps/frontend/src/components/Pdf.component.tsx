import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";

const PDFViewer: React.FC<{ fileUrl: string }> = ({ fileUrl }) => {
  return (
    <div className="pdf-viewer" style={{ height: "500px" }}>
     <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
        <Viewer fileUrl={fileUrl} />
    </Worker>

    </div>
  );
};

export default PDFViewer;
