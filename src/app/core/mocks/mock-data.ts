export const MOCK_CHAT_RESPONSE = `
¡Hola! Estás en **Modo Simulación (Mock Mode)**. 
Como no tienes acceso al backend real por temas de permisos o VPN, te estoy respondiendo de manera simulada.

Aquí tienes un ejemplo de cómo renderizo contenido rico:

### 1. Formato Básico
Puedo usar *cursivas*, **negritas**, y ~~tachados~~. También puedo incluir \`código en línea\`.

### 2. Listas
- Elemento de lista 1
- Elemento de lista 2
  - Subelemento A
  - Subelemento B

### 3. Tablas de datos
| Componente | Estado | Versión |
|------------|--------|---------|
| Frontend   | Mock   | v1.2    |
| Backend    | Offline| v0.9    |

### 4. Código Fuente
\`\`\`typescript
// Así se ve un bloque de código
export class MockSimulator {
  constructor() {
    console.log("Simulando stream de datos...");
  }
}
\`\`\`

> [!TIP]
> Recuerda que puedes apagar este modo cambiando \`useMockMode: false\` en el archivo \`environment.ts\`.

¿Qué ajuste de interfaz deseas probar ahora?
`;

export const MOCK_QUARANTINE_DOCS = [
  {
    id: "q_1",
    name: "Comedor/Comedor/02_Base_de_Datos/kfc_comer_dbo.sql",
    originalBlobName: "Comedor/Comedor/02_Base_de_Datos/kfc_comer_dbo.sql",
    uploadedBy: "Sistema",
    uploadedAt: new Date().toISOString(),
    status: "Quarantined",
    rejectReason: "Contiene contraseñas en plano",
    fileType: ".sql",
    fileSizeBytes: 1024,
    area: "Comedor"
  }
];

export const MOCK_DOCUMENTS = [
  { id: '1', name: 'Comedor/Manuales/KFC-Comedor Manual.pdf', area: 'comedor', status: 'indexed',
    indexedAt: new Date('2026-06-01T10:30:00Z'), fileHash: 'abc123hash', chunksCount: 42, fileSizeBytes: 3800000 },
  { id: '2', name: 'RRHH/Politicas_Internas/Políticas RRHH 2026.pdf', area: 'rrhh', status: 'indexed',
    indexedAt: new Date('2026-06-05T09:15:00Z'), fileHash: 'def456hash', chunksCount: 85, fileSizeBytes: 5200000 },
  { id: '3', name: 'Financiero/Presupuestos/Presupuestos Q1 2026.xlsx', area: 'financiero', status: 'indexed',
    indexedAt: new Date('2026-06-10T14:45:00Z'), fileHash: 'ghi789hash', chunksCount: 15, fileSizeBytes: 1200000 }
];

export const MOCK_UPLOAD_RESPONSE = {
  filesProcessed: 1,
  chunksIndexed: 12,
  chunksGenerated: 12,
  warnings: [],
  errors: [],
  duration: '00:00:05'
};
