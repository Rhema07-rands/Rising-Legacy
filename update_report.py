import os

with open('report_text.txt', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace ReportLab and backend PDF generation mentions with frontend native print mentions
replacements = {
    "Integrated within the Python backend utilizing the ReportLab library, this dedicated service dynamically constructs standardized, branded academic transcripts on the fly by formatting raw JSON data into secure, downloadable PDF documents.": "Integrated within the React frontend utilizing the browser's native print rendering engine, this dedicated service dynamically constructs standardized, branded academic transcripts on the fly by formatting JSON data from the API into secure, downloadable PDF documents via CSS print media queries.",
    
    "c. Pass aggregated data to the Document Generation Layer (ReportLab). d. Render official PDF transcript containing university headers, semester breakdowns, and final classification. e. Securely download PDF to Admin's local machine.": "c. Pass aggregated data to the Document Generation Layer (React Frontend). d. Render official PDF transcript containing university headers, semester breakdowns, and final classification using browser-native print rendering. e. Securely save PDF to Admin's local machine.",
    
    "ReportLab: A powerful software library utilized within the Python ecosystem to programmatically generate secure, multi-page PDF documents, serving as the core engine for transcript rendering.": "Browser Native Print Engine: A powerful rendering mechanism utilized within the React ecosystem to programmatically generate secure, multi-page PDF documents via CSS print media queries, serving as the core engine for transcript rendering.",
    
    "ReportLab was selected over basic HTML-to-PDF converters because it directly manipulates the PDF canvas, ensuring documents cannot be easily tampered with post-generation.": "The native browser print engine combined with React was selected because it allows for pixel-perfect dynamic rendering of transcripts without putting heavy processing load on the backend server, ensuring instant document generation.",
    
    "The integration of the ReportLab PDF engine provided a seamless path for escalating digital records into printable, official university documents.": "The integration of the React-based native print engine provided a seamless path for escalating digital records into printable, official university documents."
}

for old, new in replacements.items():
    text = text.replace(old, new)

with open('UPDATED_REPORT_TEXT.txt', 'w', encoding='utf-8') as f:
    f.write(text)

print("Report updated successfully.")
