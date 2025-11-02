import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useParams } from "react-router";

interface Reservation {
  name: string;
  lastName: string;
  time: string;
  email: string;
  phone: string;
  date: string;
  driverLicense: string;
  truckNumber: string;
  trailerNumber: string;
  references: string[];
  createdAt: string;
}

const ReservationDisplay: React.FC = () => {
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const params = useParams();

  useEffect(() => {
    fetch(`http://localhost:4500/reservations/${params.id}`)
      .then((res) => res.json())
      .then((reservation) => setReservation(reservation))
      .catch((err) => console.error("Error fetching reservation:", err));
  }, [params.id]);

  // Fixed PDF printing function
  const handlePrintPDF = async () => {
    if (!reservation) return;
    
    setIsGeneratingPDF(true);
    
    try {
      // Create a temporary container for PDF generation
      const pdfContainer = document.createElement('div');
      pdfContainer.style.position = 'fixed';
      pdfContainer.style.left = '0';
      pdfContainer.style.top = '0';
      pdfContainer.style.width = '210mm';
      pdfContainer.style.minHeight = '297mm';
      pdfContainer.style.padding = '20mm';
      pdfContainer.style.backgroundColor = 'white';
      pdfContainer.style.zIndex = '10000';
      pdfContainer.style.boxSizing = 'border-box';
      
      // PDF content
      pdfContainer.innerHTML = `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #3b82f6; padding-bottom: 20px;">
            <h1 style="font-size: 28px; font-weight: bold; color: #1f2937; margin: 0 0 10px 0;">
              Reservation Details
            </h1>
            <p style="font-size: 14px; color: #6b7280; margin: 0;">
              Created on: ${reservation.date} at ${reservation.time}
            </p>
          </div>

          <div style="margin-bottom: 25px;">
            <h2 style="font-size: 20px; font-weight: bold; color: #3b82f6; margin-bottom: 15px; padding-bottom: 5px; border-bottom: 1px solid #e5e7eb;">
              Personal Information
            </h2>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
              <div>
                <p style="margin: 8px 0;"><strong style="color: #374151;">Full Name:</strong><br/>${reservation.name} ${reservation.lastName}</p>
                <p style="margin: 8px 0;"><strong style="color: #374151;">Email:</strong><br/>${reservation.email}</p>
              </div>
              <div>
                <p style="margin: 8px 0;"><strong style="color: #374151;">Driver License/ID:</strong><br/>${reservation.driverLicense}</p>
                <p style="margin: 8px 0;"><strong style="color: #374151;">Phone:</strong><br/>${reservation.phone}</p>
              </div>
            </div>
          </div>

          <div style="margin-bottom: 25px;">
            <h2 style="font-size: 20px; font-weight: bold; color: #10b981; margin-bottom: 15px; padding-bottom: 5px; border-bottom: 1px solid #e5e7eb;">
              Vehicle Information
            </h2>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
              <div style="border: 1px solid #d1d5db; padding: 15px; border-radius: 8px; background: #f9fafb;">
                <p style="margin: 0 0 5px 0; font-weight: bold; color: #374151;">Truck Number</p>
                <p style="margin: 0; font-size: 18px; font-weight: bold; color: #3b82f6;">${reservation.truckNumber}</p>
              </div>
              <div style="border: 1px solid #d1d5db; padding: 15px; border-radius: 8px; background: #f9fafb;">
                <p style="margin: 0 0 5px 0; font-weight: bold; color: #374151;">Trailer Number</p>
                <p style="margin: 0; font-size: 18px; font-weight: bold; color: #10b981;">${reservation.trailerNumber}</p>
              </div>
            </div>
          </div>

          <div>
            <h2 style="font-size: 20px; font-weight: bold; color: #8b5cf6; margin-bottom: 15px; padding-bottom: 5px; border-bottom: 1px solid #e5e7eb;">
              References
            </h2>
            <ul style="margin: 0; padding-left: 20px;">
              ${reservation.references.map((ref, index) => 
                `<li style="margin-bottom: 8px; padding: 8px; background: #f8fafc; border-left: 3px solid #8b5cf6;">
                  <strong>Reference ${index + 1}:</strong> ${ref}
                </li>`
              ).join('')}
            </ul>
          </div>

          <div style="margin-top: 40px; padding-top: 20px; border-top: 2px solid #e5e7eb; text-align: center;">
            <p style="color: #6b7280; font-size: 12px;">
              Generated on ${new Date().toLocaleDateString()} - Reservation ID: ${params.id}
            </p>
          </div>
        </div>
      `;

      // Add to document
      document.body.appendChild(pdfContainer);

      // Generate PDF
      const canvas = await html2canvas(pdfContainer, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: pdfContainer.offsetWidth,
        height: pdfContainer.offsetHeight,
        scrollX: 0,
        scrollY: 0
      });

      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if content is too long
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`reservation-${reservation.name}-${reservation.date}.pdf`);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      // Clean up
      const tempContainer = document.querySelector('div[style*="z-index: 10000"]');
      if (tempContainer) {
        document.body.removeChild(tempContainer);
      }
      setIsGeneratingPDF(false);
    }
  };

  // Debug function to test PDF generation
  const debugPDF = async () => {
    if (!reservation) return;
    
    const element = document.getElementById("pdf-print-content");
    if (!element) {
      console.error("PDF element not found!");
      return;
    }
    
    console.log("PDF element found:", element);
    
    // Temporarily show the element
    const originalDisplay = element.style.display;
    element.style.display = 'block';
    element.style.position = 'fixed';
    element.style.left = '0';
    element.style.top = '0';
    element.style.zIndex = '10000';
    element.style.backgroundColor = 'white';
    
    try {
      const canvas = await html2canvas(element);
      console.log("Canvas created:", canvas);
      
      const imgData = canvas.toDataURL("image/png");
      console.log("Image data created");
      
      // Open in new window for testing
      const newWindow = window.open();
      if (newWindow) {
        newWindow.document.write(`
          <html>
            <body style="margin: 0; padding: 20px; background: #f3f4f6;">
              <img src="${imgData}" style="max-width: 100%; height: auto; border: 1px solid #ccc;" />
              <p style="margin-top: 20px; text-align: center;">
                <button onclick="window.print()" style="padding: 10px 20px; background: #3b82f6; color: white; border: none; border-radius: 5px; cursor: pointer;">
                  Print This Image
                </button>
              </p>
            </body>
          </html>
        `);
      }
    } catch (error) {
      console.error("Debug PDF error:", error);
    } finally {
      // Restore original state
      element.style.display = originalDisplay;
      element.style.position = '';
      element.style.left = '';
      element.style.top = '';
      element.style.zIndex = '';
      element.style.backgroundColor = '';
    }
  };

  if (!reservation) return <p>Loading reservation...</p>;

  return (
    <>
      {/* ================== Display Design (fancy one) ================== */}
      <div className="pdf-container">
        <div className="pdf-wrapper">
          <div className="header">
            <h1 className="title">Reservation Details</h1>
            <p className="subtitle">
              Reservation created on {reservation.date} at {reservation.time}
            </p>
            <img src="/public/flex-logo-blue.png" alt="Logo" />
          </div>

          <div className="card">
            <div className="section">
              <div className="section-header personal-header">
                <h2>Personal Information</h2>
              </div>
              <div className="section-body">
                <div className="grid">
                  <div className="column">
                    <div className="info-row">
                      <span className="label">Full Name</span>
                      <span className="value">
                        {reservation.name} {reservation.lastName}
                      </span>
                    </div>
                    <div className="info-row">
                      <span className="label">Email</span>
                      <span className="value email">{reservation.email}</span>
                    </div>
                  </div>
                  <div className="column">
                    <div className="info-row">
                      <span className="label">Driver License/ID</span>
                      <span className="value mono">
                        {reservation.driverLicense}
                      </span>
                    </div>
                    <div className="info-row">
                      <span className="label">Phone</span>
                      <span className="value">{reservation.phone}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Vehicle Info */}
            <div className="section">
              <div className="section-header vehicle-header">
                <h2>Vehicle Information</h2>
              </div>
              <div className="section-body">
                <div className="grid">
                  <div className="vehicle-card">
                    <div className="vehicle-icon blue">T</div>
                    <div>
                      <p className="label">Truck Number</p>
                      <p className="value bold">{reservation.truckNumber}</p>
                    </div>
                  </div>
                  <div className="vehicle-card">
                    <div className="vehicle-icon green">T</div>
                    <div>
                      <p className="label">Trailer Number</p>
                      <p className="value bold">{reservation.trailerNumber}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* References */}
            <div className="section">
              <div className="section-header reference-header">
                <h2>References</h2>
              </div>
              <div className="section-body">
                {reservation.references.map((reference, index) => (
                  <div key={index} className="reference-row">
                    <div className="reference-index">{index + 1}</div>
                    <span className="reference-value">{reference}</span>
                    <span className="reference-tag">Reference</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="button-group">
            <button 
              className={`btn blue ${isGeneratingPDF ? 'loading' : ''}`} 
              onClick={handlePrintPDF}
              disabled={isGeneratingPDF}
            >
              {isGeneratingPDF ? 'Generating PDF...' : 'Print Reservation'}
            </button>
            <button className="btn green">Confirm Reservation</button>
            <button className="btn gray">Edit Details</button>
            {/* Temporary debug button - remove in production */}
            <button className="btn red" onClick={debugPDF} style={{marginLeft: '10px'}}>
              Debug PDF
            </button>
          </div>
        </div>
      </div>

      {/* ================== Hidden Simple Design for PDF ================== */}
      <div id="pdf-print-content" style={{ display: "none" }}>
        <div style={{ 
          padding: '20mm', 
          backgroundColor: 'white', 
          minHeight: '297mm',
          boxSizing: 'border-box',
          fontFamily: 'Arial, sans-serif'
        }}>
          <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '10px', textAlign: 'center', color: '#1f2937' }}>
            Reservation Details
          </h2>
          <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '30px', fontSize: '14px' }}>
            Created on: {reservation.date} at {reservation.time}
          </p>

          <div style={{ marginBottom: '25px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#3b82f6', marginBottom: '15px' }}>
              Personal Information
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <p style={{ margin: '8px 0' }}><strong>Full Name:</strong> {reservation.name} {reservation.lastName}</p>
                <p style={{ margin: '8px 0' }}><strong>Email:</strong> {reservation.email}</p>
              </div>
              <div>
                <p style={{ margin: '8px 0' }}><strong>Driver License/ID:</strong> {reservation.driverLicense}</p>
                <p style={{ margin: '8px 0' }}><strong>Phone:</strong> {reservation.phone}</p>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '25px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#10b981', marginBottom: '15px' }}>
              Vehicle Information
            </h3>
            <p style={{ margin: '8px 0' }}><strong>Truck Number:</strong> {reservation.truckNumber}</p>
            <p style={{ margin: '8px 0' }}><strong>Trailer Number:</strong> {reservation.trailerNumber}</p>
          </div>

          <div>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '15px' }}>
              References
            </h3>
            <ul style={{ paddingLeft: '20px' }}>
              {reservation.references.map((ref, idx) => (
                <li key={idx} style={{ marginBottom: '8px' }}>{ref}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Add some basic styles for the PDF content */}
      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            #pdf-print-content, #pdf-print-content * {
              visibility: visible;
            }
            #pdf-print-content {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
            }
          }
        `}
      </style>
    </>
  );
};

export default ReservationDisplay;