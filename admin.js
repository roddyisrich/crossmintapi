let generatedCodes = [];
let usedCodes = [];

function generateCode() {
    const playerName = document.getElementById('playerName').value || 'Unknown';
    const timestamp = new Date().toISOString().slice(0,10).replace(/-/g,'');
    const random = Math.random().toString(36).substring(2,6).toUpperCase();
    const code = `PACK-${timestamp}-${random}`;
    
    const codeData = {
        code: code,
        playerName: playerName,
        generated: new Date().toLocaleString(),
        used: false
    };
    
    generatedCodes.push(codeData);
    
    document.getElementById('codeValue').textContent = code;
    document.getElementById('newCode').style.display = 'block';
    document.getElementById('playerName').value = '';
    
    updateCodesList();
    updateValidCodes();
}

function copyCode() {
    const code = document.getElementById('codeValue').textContent;
    navigator.clipboard.writeText(code);
    alert('Code copied to clipboard!');
}

function updateCodesList() {
    const list = document.getElementById('codesList');
    if (generatedCodes.length === 0) {
        list.innerHTML = '<em>No codes generated yet</em>';
        return;
    }
    
    list.innerHTML = generatedCodes.map(codeData => 
        `<div style="margin: 10px 0; padding: 10px; background: ${codeData.used ? '#ffebee' : '#e8f5e8'}; border-radius: 5px;">
            <strong>${codeData.code}</strong> - ${codeData.playerName}<br>
            <small>Generated: ${codeData.generated} ${codeData.used ? '(USED)' : '(ACTIVE)'}</small>
        </div>`
    ).join('');
}

function clearUsedCodes() {
    generatedCodes = generatedCodes.filter(code => !code.used);
    updateCodesList();
    updateValidCodes();
}

function exportCodes() {
    const data = JSON.stringify(generatedCodes, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pack-codes.json';
    a.click();
}

function updateValidCodes() {
    // This would update your access-codes.js file
    const activeCodes = generatedCodes.filter(c => !c.used).map(c => c.code);
    console.log('Active codes:', activeCodes);
}
