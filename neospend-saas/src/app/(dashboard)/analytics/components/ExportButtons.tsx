'use client';

import { jsPDF } from 'jspdf';
import Papa from 'papaparse';

export default function ExportButtons({ data }: { data: any }) {
    const exportCSV = () => {
        const csv = Papa.unparse(data);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'analytics.csv';
        link.click();
    };

    const exportPDF = () => {
        const doc = new jsPDF();
        doc.text('NeoSpend Analytics Report', 14, 16);
        doc.text(JSON.stringify(data, null, 2), 14, 24);
        doc.save('analytics.pdf');
    };

    return (
        <div className="flex gap-2 mt-4">
            <button
                onClick={exportCSV}
                className="px-3 py-2 text-sm border rounded-md hover:bg-muted transition"
            >
                Export CSV
            </button>
            <button
                onClick={exportPDF}
                className="px-3 py-2 text-sm border rounded-md hover:bg-muted transition"
            >
                Export PDF
            </button>
        </div>
    );
}
