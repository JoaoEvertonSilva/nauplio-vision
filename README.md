# Nauplio Vision

Crie um protótipo de uma aplicação web moderna para auxiliar produtores de camarão na identificação e contagem automática de náuplios utilizando Inteligência Artificial.

O sistema deve ser simples, intuitivo e visualmente profissional, com foco em demonstrar como a tecnologia poderia funcionar na prática.

Objetivo

O usuário deverá conseguir enviar uma foto de uma amostra contendo náuplios. O sistema simulará uma análise por Inteligência Artificial, identificando os náuplios presentes na imagem, realizando a contagem e apresentando os resultados de maneira clara.

Tela inicial

Crie um dashboard contendo:

Nome provisório do sistema: NaupliAI

Frase: “Transformando imagens em dados e dados em decisões.”

Botão principal “Analisar nova amostra”

Quantidade de amostras analisadas

Total de náuplios contabilizados

Média de náuplios por amostra

Histórico das últimas análises

Análise da amostra

Ao clicar em “Analisar nova amostra”, permitir que o usuário:

Faça upload ou arraste uma imagem da amostra.

Visualize a imagem enviada.

Clique em “Analisar com IA”.

Exiba uma pequena animação de processamento.

Mostre o resultado da análise.

Para o protótipo, a análise pode ser simulada, mas deve parecer funcional.

Resultado

Após a análise, mostrar:

Imagem analisada

Número de náuplios identificados

Indicador de confiança da IA

Data e horário da análise

Comparação com análises anteriores

Possível variação ou perda estimada

Na imagem, simule a identificação dos náuplios colocando pequenos marcadores ou círculos sobre os organismos detectados.

Exemplo:

Náuplios identificados: 1.248

Confiança da análise: 96%

Variação em relação à última amostra: -3,2%

Caso seja detectada uma redução significativa, mostrar um aviso como:

“Atenção: foi identificada uma possível redução na quantidade de náuplios.”

Histórico

Crie uma página de histórico mostrando as análises anteriores com:

Data

Quantidade identificada

Variação

Status

Opção para visualizar os detalhes

Inclua também um gráfico simples mostrando a evolução da quantidade de náuplios ao longo das análises.

Design

Utilize um design moderno relacionado à aquicultura, tecnologia e análise de dados.

A interface deve ser limpa, responsiva e fácil de utilizar em computador e celular.

Utilize cards, ícones simples, gráficos e animações suaves.

O objetivo principal do protótipo é demonstrar visualmente como uma Inteligência Artificial poderia transformar uma imagem de uma amostra em informações úteis para o produtor, ajudando a identificar perdas e melhorar a tomada de decisões.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/edd8fa8b-f9cd-4338-9074-06d082269df8).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
