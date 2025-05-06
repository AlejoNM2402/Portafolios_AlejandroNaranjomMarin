     document.addEventListener('DOMContentLoaded', () => {
        VANTA.NET({
            el: "#vanta-background",
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            scale: 1.00,
            scaleMobile: 1.00,
            color: 0x4b604,    // Color para la red
            backgroundColor: 0x000000,  // Fondo negro
            points: 10,         // Cantidad de puntos
            maxDistance: 25.00, // Distancia máxima entre puntos conectados
            spacing: 15.00      // Espaciado de los puntos
        });
        
        // Aseguramos que el div de fondo ocupe toda la pantalla
        const background = document.getElementById('vanta-background');
        background.style.position = 'fixed';
        background.style.top = '0';
        background.style.left = '0';
        background.style.width = '100%';
         
        background.style.height = '100%';
        background.style.zIndex = '-1';
    });
    


