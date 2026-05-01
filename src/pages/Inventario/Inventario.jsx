import React, { useContext, useState, useEffect, useRef } from 'react';
import { AppDataContext } from '../../context/AppDataContext';
import { ScanBarcode, EyeOff, Save, Download, FileText } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Inventario = () => {
  const { bottles, editBottle } = useContext(AppDataContext);
  
  // Lista de itens a serem contados
  const [inventoryList, setInventoryList] = useState([]);
  const [isBlindMode, setIsBlindMode] = useState(true);
  const [barcodeBuffer, setBarcodeBuffer] = useState('');
  
  const searchInputRef = useRef(null);

  useEffect(() => {
    // Inicializa a lista de inventário com as garrafas atuais (zerando a contagem atual)
    setInventoryList(bottles.map(b => ({
      ...b,
      counted: 0,
      difference: 0
    })));
  }, [bottles]);

  // Barcode Scanner Listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignora se estiver digitando em um input normal
      if (e.target.tagName === 'INPUT' && e.target.type !== 'hidden') return;

      if (e.key === 'Enter') {
        if (barcodeBuffer.length > 3) {
          handleBarcodeScanned(barcodeBuffer);
        }
        setBarcodeBuffer('');
      } else if (e.key.length === 1) { // Só letras/números
        setBarcodeBuffer(prev => prev + e.key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [barcodeBuffer, inventoryList]);

  const handleBarcodeScanned = (code) => {
    // Simulação: se o código lido for parte do nome ou tivermos um campo 'barcode' no contexto.
    // Vamos procurar pelo nome ignorando case, ou se criássemos um campo de código.
    // Como os leitores às vezes lêem códigos UPC, vamos simular que ele foca no produto correto
    // ou incrementa +1 unidade.
    alert(`Código de Barras lido: ${code}`);
    // Exemplo: encontrar produto com aquele código (no mundo real: b.barcode === code)
    // Aqui usaremos o search pra demonstrar
  };

  const handleCountChange = (id, value) => {
    const num = parseFloat(value) || 0;
    setInventoryList(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, counted: num, difference: num - item.currentStock };
      }
      return item;
    }));
  };

  const handleSaveInventory = () => {
    inventoryList.forEach(item => {
      // Atualiza o estoque real no banco
      editBottle({ ...item, currentStock: item.counted });
    });
    alert('Inventário salvo com sucesso! Estoque atualizado.');
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.setTextColor(36, 48, 94); // --bg-main
    doc.text('Relatório de Inventário - PulseBar', 14, 22);
    
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Data: ${new Date().toLocaleDateString()} | Tipo: ${isBlindMode ? 'Cego' : 'Aberto'}`, 14, 30);

    const tableColumn = ["Produto", "Estoque Sistema", "Contagem Física", "Diferença", "Custo da Diferença"];
    const tableRows = [];

    inventoryList.forEach(item => {
      const diffCost = (item.difference * item.cost).toFixed(2);
      const rowData = [
        item.name,
        isBlindMode ? '?' : `${item.currentStock} un`,
        `${item.counted} un`,
        item.difference > 0 ? `+${item.difference}` : item.difference,
        `R$ ${diffCost}`
      ];
      tableRows.push(rowData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      theme: 'grid',
      styles: { fontSize: 9 },
      headStyles: { fillColor: [55, 71, 133] } // --bg-card
    });

    doc.save('Inventario_PulseBar.pdf');
  };

  return (
    <div style={{ paddingBottom: '4rem' }}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-gold" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ScanBarcode size={28} /> Inventário Digital
          </h1>
          <p className="text-muted">Contagem mobile, modo cego e leitor de código de barras.</p>
        </div>
        <div className="flex gap-4">
          <button className={`btn ${isBlindMode ? 'btn-danger' : 'btn-outline'}`} onClick={() => setIsBlindMode(!isBlindMode)}>
            <EyeOff size={18} /> {isBlindMode ? 'Modo Cego ON' : 'Modo Cego OFF'}
          </button>
          <button className="btn btn-outline" onClick={handleExportPDF}>
            <Download size={18} /> Exportar PDF
          </button>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem', backgroundColor: 'var(--bg-input)' }}>
        <p className="text-muted" style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
          <strong>Dica:</strong> Conecte um leitor USB/Bluetooth. O sistema reconhece a leitura de códigos automaticamente em segundo plano. Funciona Offline.
        </p>
      </div>

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
        {inventoryList.map(item => (
          <div key={item.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem' }}>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '1rem', color: 'var(--text-main)' }}>{item.name}</h3>
              <p className="text-muted" style={{ fontSize: '0.75rem' }}>{item.brand}</p>
              
              {!isBlindMode && (
                <p style={{ fontSize: '0.85rem', marginTop: '0.5rem', color: 'var(--accent-gold)' }}>
                  Sistema: {Number.isInteger(item.currentStock) ? item.currentStock : item.currentStock.toFixed(2)} un
                </p>
              )}
            </div>

            <div style={{ width: '100px' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px', textAlign: 'center' }}>
                Contagem
              </label>
              <input 
                type="number" 
                className="form-control" 
                style={{ textAlign: 'center', fontSize: '1.2rem', padding: '0.5rem' }}
                value={item.counted || ''}
                onChange={(e) => handleCountChange(item.id, e.target.value)}
                placeholder="0"
                step="0.1"
              />
            </div>
          </div>
        ))}
      </div>

      <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 10 }}>
        <button 
          className="btn btn-success" 
          style={{ padding: '1rem 2rem', fontSize: '1.1rem', boxShadow: 'var(--shadow-glow-green)', borderRadius: '50px' }}
          onClick={handleSaveInventory}
        >
          <Save size={24} style={{ marginRight: '0.5rem' }} /> Salvar e Sincronizar Estoque
        </button>
      </div>
    </div>
  );
};

export default Inventario;
