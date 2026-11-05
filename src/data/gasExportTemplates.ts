import gasCodeGs from '../../gas-export/Code.gs?raw';
import gasIndexHtml from '../../gas-export/Index.html?raw';
import gasAppsscriptJson from '../../gas-export/appsscript.json?raw';
import gasReadmeGuide from '../../gas-export/README.md?raw';

export const GAS_SPREADSHEET_ID = '1tWcZ4OaGZKOcX1PEvVNadyf9mM_igaKcF3ZV_b3L7Ng';

export interface GasFileTemplate {
  name: string;
  filename: string;
  language: string;
  description: string;
  content: string;
}

export const GAS_CODE_GS_CONTENT = gasCodeGs;
export const GAS_INDEX_HTML_CONTENT = gasIndexHtml;
export const GAS_APPSSCRIPT_JSON_CONTENT = gasAppsscriptJson;
export const GAS_README_GUIDE_CONTENT = gasReadmeGuide;

export const GAS_EXPORT_TEMPLATES: GasFileTemplate[] = [
  {
    name: 'Code.gs',
    filename: 'Code.gs',
    language: 'javascript',
    description: 'สคริปต์หลักฝั่ง Server (CRUD, Google Sheets API, Gmail, AI Tutor, Database Auto-Setup)',
    content: GAS_CODE_GS_CONTENT,
  },
  {
    name: 'Index.html',
    filename: 'Index.html',
    language: 'html',
    description: 'เทมเพลตหน้าเว็บแอป (HTML Service) ครบทุกโมดูล, Scratch Simulator, Micro:bit Matrix, PDPA Lab, Daily Journal และการซิงก์ Google Sheets',
    content: GAS_INDEX_HTML_CONTENT,
  },
  {
    name: 'appsscript.json',
    filename: 'appsscript.json',
    language: 'json',
    description: 'ไฟล์ Manifest กำหนด Timezone Asia/Bangkok, V8 Runtime, และสิทธิ์การเข้าถึง OAuth Scopes',
    content: GAS_APPSSCRIPT_JSON_CONTENT,
  },
  {
    name: 'คู่มือการติดตั้ง.md',
    filename: 'README_GAS_DEPLOYMENT.md',
    language: 'markdown',
    description: 'คู่มือและขั้นตอนการติดตั้งบน Google Apps Script ทีละขั้นตอนอย่างละเอียด',
    content: GAS_README_GUIDE_CONTENT,
  },
];
