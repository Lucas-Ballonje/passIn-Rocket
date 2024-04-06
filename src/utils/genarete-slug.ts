export function generateSlug(text: string): string {
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
  }
//Esse código substitui todos os caracteres que são letras, espaços ou hifens por uma string vazia,
//Ou seja, remove caracteres especiais 