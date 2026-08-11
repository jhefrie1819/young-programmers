// =========================================================================
// === DECLARACIÓN DE VARIABLES GLOBALES Y CACHÉ DE ELEMENTOS DEL DOM ===
// =========================================================================

// --- Variables de Modales y Sesión ---
const loginModal = document.getElementById('login-modal');
const registerModal = document.getElementById('register-modal');
const loginBtn = document.getElementById('login-btn');
const registerBtn = document.getElementById('register-btn');
const logoutBtn = document.getElementById('logout-btn');
const welcomeMessageContainer = document.getElementById('welcome-message');
const welcomeText = document.getElementById('welcome-text');
const userRoleDisplay = document.getElementById('user-role');
const closeLoginBtn = document.getElementById('close-login-btn');
const closeRegisterBtn = document.getElementById('close-register-btn');

// Definición de Administradores Fijos (Hardcodeados)
const fixedAdmins = {
    'jmontesino123': '0987',
    'ssantana': '1234',
    'admin_dev': 'contraseña_segura_aqui',
    'ronaldo': '777' 
};

// --- Variables del Asistente Virtual (Syntax Laughter) ---
const chatToggleBtn = document.getElementById('chat-toggle-btn');
const chatWindow = document.getElementById('ia-chat-window');
const closeChatBtn = document.getElementById('close-chat-btn');
const chatBody = document.getElementById('chat-body');
const optionsContainer = document.getElementById('options-container');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const typingIndicator = document.getElementById('ia-typing-indicator');

// =========================================================================
// === BASE DE CONOCIMIENTO Y OPCIONES DEL ASISTENTE (UNIFICADAS) ===
// =========================================================================

const knowledgeBase = {
    // Respuestas detalladas
    'quienes somos': { 
        text: "Young Programmers nace de la visión de **dos jóvenes programadores en 2025**, con el objetivo de **diseñar el futuro** de las empresas mediante soluciones tecnológicas a medida. Nos proyectamos a ser una **empresa tecnológica líder** reconocida globalmente, transformando el mundo con innovación, sostenibilidad y un enfoque centrado en la excelencia empresarial. Queremos **Diseñar el futuro, hoy**."
    },
    'servicios': { 
        text: "Nuestros servicios clave incluyen: Diseño Web, Diagnóstico Tecnológico, Desarrollo de Apps (web/móvil) y Soporte Técnico Remoto. ¡Podemos llevar tu negocio a otro nivel!", 
        jumpToId: 'servicios', jumpText: 'Ver la sección de Servicios'
    },
    'contacto': { 
        text: "Puede contactarnos por email: elkarma850@gmail.com o ssantanatavera479@gmail.com. Para atención inmediata, use los números de teléfono para WhatsApp.", 
        jumpToId: 'datos', jumpText: 'Ir a Contacto / Ubicación'
    },
    'ubicacion': { 
        text: "Estamos en Bogotá, Colombia. Las direcciones exactas son clicables para verlas en Google Maps en la sección 'Contacto'.", 
        jumpToId: 'datos', jumpText: 'Ir a Contacto / Ubicación'
    },
    'ronaldo': { 
        text: ">>> TEMA ACTIVADO: MATRIX ONLINE. Eres el elegido. Disfruta de la interfaz. Escribe 'messi' para volver al color Neón Rojo." , 
        theme: 'matrix'
    },
    'messi': { 
        text: ">>> TEMA ORIGINAL RESTAURADO. Volviendo al Neón Rojo estándar. ¡Un golazo!",
        theme: 'default' 
    },
    // Respuestas cortas o complementarias
    'hola': { text: "¡Hola! Soy **Syntax Laughter**, el asistente digital. Si necesitas ayuda, pulsa el botón 'Opciones Principales' o escribe 'ayuda'." },
    'gracias': { text: "De nada. Es un placer servirte. Si necesitas algo más, no dudes en preguntar." },
    'quien eres': { text: "Soy **Syntax Laughter**, el asistente digital desarrollado por Young Programmers. Mi propósito es ayudarte a navegar por nuestros servicios." },
    'ayuda': { text: "Estoy aquí para ayudarte. ¿Necesitas información sobre nuestros servicios o soporte técnico?" },
    'default': { text: "Lo siento, mi base de conocimientos no tiene una respuesta precisa para eso. Por favor, intenta reformular la pregunta o pulsa el botón 'Opciones Principales' para ver lo que puedo hacer." }
};

// Opciones principales (botones que se generan)
const chatOptions = [
    { text: "Quiénes Somos", queryKey: "quienes somos" },
    { text: "Ver Servicios", queryKey: "servicios" },
    { text: "Contacto y Ubicación", queryKey: "contacto" },
    { text: "Necesito Ayuda", queryKey: "ayuda" },
];

// =========================================================================
// === INICIALIZACIÓN Y LISTENERS PRINCIPALES ===
// =========================================================================

document.addEventListener('DOMContentLoaded', () => {
    // 1. Configuración de Modales y Sesión
    setupModalListeners();
    checkSession(); 

    // 2. Configuración del Asistente Virtual
    setupChatListeners();
    
    // 3. Inicialización de Animaciones de Scroll
    setupScrollAnimations();
});

// =========================================================================
// === LÓGICA DE MODALES Y AUTENTICACIÓN (LOCAL STORAGE) ===
// =========================================================================

function setupModalListeners() {
    // Mostrar/Ocultar con botones de la cabecera
    loginBtn.addEventListener('click', () => { loginModal.style.display = 'flex'; registerModal.style.display = 'none'; });
    registerBtn.addEventListener('click', () => { registerModal.style.display = 'flex'; loginModal.style.display = 'none'; });

    // Cerrar con el botón 'x'
    closeLoginBtn.addEventListener('click', closeModals);
    closeRegisterBtn.addEventListener('click', closeModals);

    // Cerrar haciendo clic fuera
    window.addEventListener('click', (event) => {
        if (event.target === loginModal || event.target === registerModal) {
            closeModals();
        }
    });
    
    // Botón de Cerrar Sesión
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('loggedInUser');
        localStorage.removeItem('userRole'); 
        localStorage.removeItem('userTheme'); // Agregado para limpiar el tema
        checkSession();
    });

    // **IMPORTANTE**: Asignar las funciones a los formularios.
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.onsubmit = (event) => { event.preventDefault(); login(); };
    }
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.onsubmit = (event) => { event.preventDefault(); register(); };
    }
}

/**
 * Cierra ambos modales de autenticación.
 */
function closeModals() {
    loginModal.style.display = 'none';
    registerModal.style.display = 'none';
    // Limpiar mensajes al cerrar
    if(document.getElementById('login-message')) document.getElementById('login-message').textContent = '';
    if(document.getElementById('register-message')) document.getElementById('register-message').textContent = '';
}

/**
 * Valida si el texto contiene solo letras (incluyendo Ñ, acentos y espacios).
 */
function isValidName(text) {
    if (!text) return true;
    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    return nameRegex.test(text);
}

/**
 * Maneja la lógica de inicio de sesión.
 */
function login() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    const roleSelector = document.getElementById('login-role').value;
    const loginMessage = document.getElementById('login-message');

    let isAuthenticated = false;
    let grantedRole = roleSelector; 
    let themeToApply = null;

    // 1. Verificar si es uno de los administradores fijos
    if (fixedAdmins.hasOwnProperty(username) && fixedAdmins[username] === password) {
        isAuthenticated = true;
        grantedRole = 'Administrador';
        if (username === 'ronaldo') {
             themeToApply = 'matrix';
        }
    } 
    // 2. Verificar si es un usuario registrado en localStorage
    else {
        const storedPassword = localStorage.getItem(username);
        if (storedPassword && storedPassword === password) {
            isAuthenticated = true;
            // Si el usuario selecciona Admin pero no es un Admin fijo, se le asigna Usuario
            grantedRole = 'Usuario'; 
        }
    }

    if (isAuthenticated) {
        localStorage.setItem('loggedInUser', username);
        localStorage.setItem('userRole', grantedRole);
        if (themeToApply) localStorage.setItem('userTheme', themeToApply);
        
        loginMessage.textContent = '¡Acceso Concedido!';
        loginMessage.style.color = 'var(--accent-color)';
        
        setTimeout(() => {
            closeModals();
            checkSession();
        }, 1000);
    } else {
        loginMessage.textContent = 'Credenciales Inválidas. Intente de nuevo.';
        loginMessage.style.color = 'var(--primary-color)';
    }
}

/**
 * Maneja la lógica de registro de nuevo usuario.
 */
function register() {
    const name = document.getElementById('register-name').value.trim();
    const lastname = document.getElementById('register-lastname').value.trim();
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;
    const termsAccepted = document.getElementById('register-terms').checked; 
    const genderSelected = document.querySelector('input[name="register-gender"]:checked');
    const registerMessage = document.getElementById('register-message');
    
    // Validaciones
    if (!termsAccepted) { registerMessage.textContent = 'Debe aceptar los términos.'; registerMessage.style.color = 'red'; return; }
    if (!genderSelected) { registerMessage.textContent = 'Debe seleccionar un Género.'; registerMessage.style.color = 'red'; return; }
    if (!isValidName(name) || !isValidName(lastname)) { registerMessage.textContent = 'Nombre/Apellido solo pueden contener letras y espacios.'; registerMessage.style.color = 'red'; return; }
    if (username.length < 3 || password.length < 4) { registerMessage.textContent = 'Usuario/ID debe tener 3+ y la contraseña 4+ caracteres.'; registerMessage.style.color = 'red'; return; }
    if (fixedAdmins.hasOwnProperty(username)) { registerMessage.textContent = `El usuario ${username} está reservado.`; registerMessage.style.color = 'red'; return; }

    // Registro
    if (localStorage.getItem(username)) {
        registerMessage.textContent = 'Este usuario ya existe.';
        registerMessage.style.color = 'red';
    } else {
        // Almacena la contraseña (simplificado)
        localStorage.setItem(username, password);
        registerMessage.textContent = 'Registro exitoso. ¡Bienvenido!';
        registerMessage.style.color = 'var(--accent-color)';
        
        // Limpiar formulario y cerrar modal
        document.getElementById('register-form').reset();
        setTimeout(closeModals, 1500); 
    }
}


/**
 * Verifica la sesión actual y actualiza la interfaz (botones y mensaje de bienvenida).
 */
function checkSession() {
    const user = localStorage.getItem('loggedInUser');
    const role = localStorage.getItem('userRole');
    let currentTheme = localStorage.getItem('userTheme') || 'default';

    // Manejo del tema (Matrix Easter Egg)
    if (currentTheme === 'matrix') {
        document.body.classList.add('matrix-theme');
    } else {
        document.body.classList.remove('matrix-theme');
    }

    if (user) {
        // Ocultar Login/Registro, Mostrar Logout
        loginBtn.style.display = 'none';
        registerBtn.style.display = 'none';
        logoutBtn.style.display = 'block';
        welcomeMessageContainer.style.display = 'flex'; 
        
        welcomeText.textContent = `[ACCESO CONCEDIDO] Bienvenido, ${user}.`;
        userRoleDisplay.textContent = `(${role.toUpperCase()})`; 

        // Estilos y mensaje especial para administradores
        if (role === 'Administrador') {
            welcomeText.textContent = `[MODO ADMIN ACTIVADO] Hola, ${user}. El sistema está bajo tu control.`;
            welcomeMessageContainer.style.borderColor = 'yellow';
            welcomeMessageContainer.style.textShadow = '0 0 10px yellow';
            welcomeMessageContainer.style.color = 'yellow';
            userRoleDisplay.style.color = 'yellow';
            userRoleDisplay.style.borderColor = 'yellow';
        } else {
            // Restablece estilos para usuarios normales (verde/neón primario)
            welcomeMessageContainer.style.borderColor = 'var(--primary-color)';
            welcomeMessageContainer.style.textShadow = '0 0 10px var(--primary-color)';
            welcomeMessageContainer.style.color = 'var(--primary-color)';
            userRoleDisplay.style.color = 'var(--accent-color)';
            userRoleDisplay.style.borderColor = 'var(--accent-color)';
        }

    } else {
        // Mostrar Login/Registro, Ocultar Logout
        loginBtn.style.display = 'block';
        registerBtn.style.display = 'block';
        logoutBtn.style.display = 'none';
        welcomeMessageContainer.style.display = 'none';
        localStorage.removeItem('userTheme'); // Limpia el tema al cerrar sesión
    }
}


// =========================================================================
// === LÓGICA DEL ASISTENTE VIRTUAL (SYNTAX LAUGHTER) ===
// =========================================================================

function setupChatListeners() {
    // 1. Manejar Apertura/Cierre
    chatToggleBtn.addEventListener('click', () => {
        chatWindow.style.display = chatWindow.style.display === 'flex' ? 'none' : 'flex';
        if (chatWindow.style.display === 'flex') {
            chatBody.scrollTop = chatBody.scrollHeight; 
            showInitialGreeting(); // Mostrar opciones al abrir

            // CORRECCIÓN FINAL DE ENFOQUE: Espera un momento para que el CSS se aplique 
            // y el elemento sea realmente enfocable.
            setTimeout(() => {
                if (userInput) userInput.focus(); 
            }, 50); // Un pequeño retraso de 50ms
        }
    });

    closeChatBtn.addEventListener('click', () => {
        chatWindow.style.display = 'none';
    });

    // 2. Lógica de Envío/Opciones
    
    // Se añaden listeners solo si el elemento existe (VERIFICACIÓN ROBUSTA)
    if (sendBtn && userInput) { 
        sendBtn.addEventListener('click', sendMessage);
        userInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                sendMessage();
            }
        });
    }
    
    // 3. Listener para las opciones generadas
    optionsContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('chat-option')) {
            const queryKey = event.target.getAttribute('data-key');
            const userText = event.target.textContent;

            addUserMessage(userText); 
            optionsContainer.innerHTML = ''; // Limpiar opciones al seleccionar
            handleUserQuery(queryKey);
        }
    });
}

/**
 * Muestra el saludo inicial y las opciones principales del chat.
 */
function showInitialGreeting() {
    // Solo muestra el mensaje si el chat está vacío
    if (chatBody.children.length === 0) {
        const welcomeText = knowledgeBase['hola'].text;
        addIAResponse(welcomeText); 
    }
    
    // Luego, siempre muestra las opciones
    showOptions();
}

/**
 * Genera y muestra los botones de opciones principales.
 */
function showOptions() {
    optionsContainer.innerHTML = ''; // Limpiar opciones existentes antes de generarlas

    // Botones de opciones (Menú principal)
    chatOptions.forEach(option => {
        const button = document.createElement('button');
        button.className = 'chat-option';
        button.textContent = option.text;
        button.setAttribute('data-key', option.queryKey);
        optionsContainer.appendChild(button);
    });
    
    // Botón para volver al menú principal
    const returnButton = document.createElement('button');
    returnButton.className = 'chat-option';
    returnButton.textContent = 'Opciones Principales';
    returnButton.setAttribute('data-key', 'hola'); // Usar 'hola' para refrescar el menú
    optionsContainer.appendChild(returnButton);

    optionsContainer.style.display = 'flex';
    chatBody.scrollTop = chatBody.scrollHeight;
}

/**
 * Agrega un mensaje del usuario al cuerpo del chat.
 */
function addUserMessage(text) {
    const userMessage = document.createElement('div');
    userMessage.classList.add('message', 'user-message');
    userMessage.textContent = text;
    chatBody.appendChild(userMessage);
    chatBody.scrollTop = chatBody.scrollHeight; 
}


/**
 * Agrega un mensaje al cuerpo del chat (sin botones de navegación).
 */
function addIAResponse(text) {
    const response = document.createElement('div');
    response.classList.add('message', 'ia-message');
    // Reemplaza **texto** por <strong>texto</strong>
    response.innerHTML = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
    chatBody.appendChild(response);
    chatBody.scrollTop = chatBody.scrollHeight; 
}


/**
 * Agrega un mensaje de respuesta de la IA, con un botón de navegación opcional.
 */
function addIAResponseWithJump(text, jumpToId = null, jumpText = null) {
    const response = document.createElement('div');
    response.classList.add('message', 'ia-message');
    response.innerHTML = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');

    chatBody.appendChild(response);

    if (jumpToId && jumpText) {
        const jumpButton = document.createElement('a');
        jumpButton.classList.add('chat-jump-btn');
        jumpButton.href = `#${jumpToId}`;
        jumpButton.textContent = jumpText;
        jumpButton.target = '_self'; 
        
        jumpButton.addEventListener('click', () => {
            chatWindow.style.display = 'none'; // Cerrar chat al hacer jump
        });

        response.appendChild(jumpButton);
    }

    chatBody.scrollTop = chatBody.scrollHeight; 
}

/**
 * Lógica de envío de mensaje desde el input de texto.
 */
function sendMessage() {
    const text = userInput.value.trim();

    if (text === '') return;

    addUserMessage(text);
    userInput.value = '';
    
    // Limpiar opciones si el usuario escribe en el input
    optionsContainer.innerHTML = '';
    
    handleUserQuery(text);
}


/**
 * Función principal para manejar la consulta del usuario, incluyendo Easter Eggs y navegación.
 */
function handleUserQuery(query) {
    const normalizedQuery = query.toLowerCase().trim();
    let responseData = knowledgeBase['default']; // Respuesta por defecto

    // 1. Búsqueda directa o por palabra clave
    if (knowledgeBase[normalizedQuery]) {
        responseData = knowledgeBase[normalizedQuery];
    } else {
        // Búsqueda por palabra clave contenida
        for (const keyword in knowledgeBase) {
            // Ignorar las claves de los Easter Eggs y las respuestas por defecto/hola
            if (['ronaldo', 'messi', 'default', 'hola'].includes(keyword)) continue; 
            
            if (normalizedQuery.includes(keyword)) {
                responseData = knowledgeBase[keyword];
                break;
            }
        }
    }
    
    // 2. Simulación de IA escribiendo
    typingIndicator.style.display = 'block';
    chatBody.scrollTop = chatBody.scrollHeight;

    // 3. Aplicar respuesta y temas después del retraso
    setTimeout(() => {
        typingIndicator.style.display = 'none';

        // Manejo del tema (Easter Egg)
        if (responseData.theme) {
            if (responseData.theme === 'matrix') {
                document.body.classList.add('matrix-theme');
                localStorage.setItem('userTheme', 'matrix');
            } else {
                document.body.classList.remove('matrix-theme');
                localStorage.removeItem('userTheme');
            }
        }
        
        // Mostrar respuesta y botón de navegación si existe
        addIAResponseWithJump(
            responseData.text, 
            responseData.jumpToId, 
            responseData.jumpText
        );

        // Vuelve a mostrar las opciones después de la respuesta de la IA.
        setTimeout(showOptions, 1500); 

    }, 1500); 
}


// =========================================================================
// === ANIMACIÓN DE SCROLL ===
// =========================================================================

function setupScrollAnimations() {
    const sections = document.querySelectorAll('.fade-in-section');
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); 
            }
        });
    }, {
        rootMargin: '0px',
        threshold: 0.1 
    });

    sections.forEach(section => {
        observer.observe(section);
    });
}