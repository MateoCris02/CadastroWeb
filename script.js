document.getElementById('uploadForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const fileInput = document.getElementById('fileInput');
    const resultContainer = document.getElementById('resultContainer');
    const loadingMessage = document.getElementById('loadingMessage');
    const file = fileInput.files[0];
    
    if (!file) {
        alert('Por favor, selecciona una imagen.');
        return;
    }
    
    loadingMessage.style.display = 'block';
    resultContainer.innerHTML = '';

    const formData = new FormData();
    formData.append('image_file', file);
    formData.append('size', 'auto');

    try {
        const response = await fetch('https://api.remove.bg/v1.0/removebg', {
            method: 'POST',
            headers: {
                'X-Api-Key': 'J1yyJSE76Kt9rkRdiPPWkQFi'  // Sustituye 'INSERT_YOUR_API_KEY_HERE' con tu clave de API
            },
            body: formData
        });

        if (response.ok) {
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);

            // Crear un objeto Image
            const img = new Image();
            img.src = url;
            
            img.onload = () => {
                // Crear un canvas para redimensionar la imagen
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                // Ajustar el canvas al tamaño deseado
                canvas.width = 1000;
                canvas.height = 1000;

                // Pintar el fondo de blanco
                ctx.fillStyle = "#FFFFFF";
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                // Calcular el tamaño y la posición de la imagen para centrarla
                const aspectRatio = img.width / img.height;
                let drawWidth, drawHeight;
                if (aspectRatio > 1) {
                    drawWidth = 1000;
                    drawHeight = 1000 / aspectRatio;
                } else {
                    drawHeight = 1000;
                    drawWidth = 1000 * aspectRatio;
                }
                const drawX = (1000 - drawWidth) / 2;
                const drawY = (1000 - drawHeight) / 2;

                // Dibujar la imagen redimensionada y centrada en el canvas
                ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);

                // Crear un enlace para descargar la imagen
                const downloadUrl = canvas.toDataURL('image/png');
                resultContainer.innerHTML = `
                    <img src="${downloadUrl}" alt="Resultado">
                    <a href="${downloadUrl}" download="no-bg.png" class="download-button">Descargar Imagen</a>
                `;
            };
        } else {
            const error = await response.text();
            alert('Error al eliminar el fondo: ' + error);
        }
    } catch (error) {
        alert('Ocurrió un error: ' + error);
    } finally {
        loadingMessage.style.display = 'none';
    }
});
