import type { Product } from '../types';

interface VoiceControlCallbacks {
  onAddToCart: (product: Product) => void;
  onOpenCart: () => void;
  onCloseCart: () => void;
  onCheckout: () => void;
  onConsultAI: () => void;
}

const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

export class VoiceControlService {
  private recognition: any | null;
  private products: Product[];
  private callbacks: VoiceControlCallbacks;
  private setListening: (isListening: boolean) => void;
  private setFeedback: (feedback: string) => void;

  constructor(
    products: Product[],
    callbacks: VoiceControlCallbacks,
    setListening: (isListening: boolean) => void,
    setFeedback: (feedback: string) => void
  ) {
    this.products = products;
    this.callbacks = callbacks;
    this.setListening = setListening;
    this.setFeedback = setFeedback;

    if (!SpeechRecognition) {
      this.recognition = null;
      console.warn("Speech Recognition not supported in this browser.");
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.continuous = false;
    this.recognition.lang = 'pt-BR';
    this.recognition.interimResults = false;
    this.setupListeners();
  }

  private setupListeners() {
    if (!this.recognition) return;

    this.recognition.onstart = () => {
      this.setListening(true);
      this.setFeedback('Ouvindo...');
    };

    this.recognition.onend = () => {
      this.setListening(false);
      setTimeout(() => this.setFeedback(''), 3000);
    };

    this.recognition.onerror = (event: any) => {
      console.error('Erro no reconhecimento de voz:', event.error);
      this.setFeedback(`Erro: ${event.error}`);
      this.setListening(false);
    };

    this.recognition.onresult = (event: any) => {
      const command = event.results[0][0].transcript.toLowerCase().trim();
      this.processCommand(command);
    };
  }

  private processCommand(command: string) {
    console.log('Comando recebido:', command);
    this.setFeedback(`Processando: "${command}"`);

    const productMatch = this.products.find(p => command.includes(p.name.toLowerCase().split(' ')[0]));
    if (productMatch && (command.startsWith('adicionar') || command.startsWith('colocar'))) {
      this.callbacks.onAddToCart(productMatch);
      this.setFeedback(`"${productMatch.name}" adicionado!`);
      return;
    }

    if (command.includes('abrir carrinho')) {
      this.callbacks.onOpenCart();
      this.setFeedback('Abrindo carrinho.');
      return;
    }

    if (command.includes('fechar carrinho')) {
      this.callbacks.onCloseCart();
      this.setFeedback('Fechando carrinho.');
      return;
    }

    if (command.includes('finalizar compra') || command.includes('pagar')) {
      this.callbacks.onCheckout();
      this.setFeedback('Iniciando pagamento.');
      return;
    }

    if (command.includes('consultar ia') || command.includes('estilo')) {
      this.callbacks.onConsultAI();
      this.setFeedback('Consultando o IA Stylist.');
      return;
    }

    this.setFeedback(`Comando não reconhecido: "${command}"`);
  }

  public startListening() {
    if (!this.recognition) {
      this.setFeedback("Controle de voz não é suportado neste navegador.");
      return;
    }
    try {
      this.recognition.start();
    } catch (e) {
      console.error("Não foi possível iniciar o reconhecimento:", e);
      if (!this.setListening) { // Already listening
          this.setFeedback("Microfone já está ativo.");
      }
    }
  }
}