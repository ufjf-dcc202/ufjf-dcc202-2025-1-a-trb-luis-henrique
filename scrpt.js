
// Variáveis globais
let sementeSelecionada = null;
let dinheiro = 0;
let turno = 1;
let sementes = { cenoura: 3, tomate: 3, alface: 3 };
let modoRegar = false;

function atualizarIndicadores() {
	document.getElementById('dinheiro').textContent = `Dinheiro: $${dinheiro}`;
	document.getElementById('turno').textContent = `Turno: ${turno}`;
	document.getElementById('sementes-cenoura').textContent = `Cenoura: ${sementes.cenoura}`;
	document.getElementById('sementes-tomate').textContent = `Tomate: ${sementes.tomate}`;
	document.getElementById('sementes-alface').textContent = `Alface: ${sementes.alface}`;
	
	// Atualizar botões para mostrar modo ativo
	const btnRegar = document.getElementById('btn-regar');
	if (modoRegar) {
		btnRegar.textContent = 'Regar (ATIVO)';
		btnRegar.style.backgroundColor = '#4CAF50';
	} else {
		btnRegar.textContent = 'Regar';
		btnRegar.style.backgroundColor = '';
	}
}

atualizarIndicadores();

// Seleção de semente
document.getElementById('btn-cenoura').addEventListener('click', function() {
	sementeSelecionada = 'cenoura';
	modoRegar = false; // Desativar modo regar ao selecionar semente
	atualizarIndicadores();
});
document.getElementById('btn-tomate').addEventListener('click', function() {
	sementeSelecionada = 'tomate';
	modoRegar = false; // Desativar modo regar ao selecionar semente
	atualizarIndicadores();
});
document.getElementById('btn-alface').addEventListener('click', function() {
	sementeSelecionada = 'alface';
	modoRegar = false; // Desativar modo regar ao selecionar semente
	atualizarIndicadores();
});


// Estado das plantas: para cada célula, guarda fase, regada, turnos sem regar, tipo

let estadoPlantas = {};
const maxFase = 3;
const maxSemAgua = 2;
let celulaSelecionada = null;

for (let i = 0; i < 12; i++) {
	for (let j = 0; j < 12; j++) {
		const celula = document.getElementById(`celula-${i}-${j}`);
		if (!celula) continue;
		celula.addEventListener('click', function() {
			// Se modo regar estiver ativo, regar a planta diretamente
			if (modoRegar && (
				celula.classList.contains('plantado-cenoura') ||
				celula.classList.contains('plantado-tomate') ||
				celula.classList.contains('plantado-alface')
			)) {
				if (!celula.classList.contains('regada')) {
					celula.classList.add('regada');
					if (estadoPlantas[celula.id]) {
						estadoPlantas[celula.id].regada = true;
						estadoPlantas[celula.id].semAgua = 0;
					}
				}
				return;
			}
			
			// Limpar pedra ou erva daninha
			if (celula.classList.contains('pedra') || celula.classList.contains('erva')) {
				celula.classList.remove('pedra', 'erva');
				celula.classList.add('vazio');
				return;
			}
			// Preparar solo
			if (celula.classList.contains('vazio')) {
				celula.classList.remove('vazio');
				celula.classList.add('preparado');
				return;
			}
			// Plantar
							if (celula.classList.contains('preparado') && sementeSelecionada) {
								// Verificar se tem sementes suficientes
								if (sementes[sementeSelecionada] <= 0) {
									alert(`Você não tem sementes de ${sementeSelecionada}!`);
									return;
								}
								
								celula.classList.remove(
									'preparado', 'plantado-cenoura', 'plantado-tomate', 'plantado-alface',
									'fase1-cenoura', 'fase1-tomate', 'fase1-alface',
									'fase2-cenoura', 'fase2-tomate', 'fase2-alface',
									'fase3-cenoura', 'fase3-tomate', 'fase3-alface',
									'pronta', 'regada', 'selecionada', 'morta'
								);
								let tipo = '';
								if (sementeSelecionada === 'cenoura') {
									celula.classList.add('plantado-cenoura', 'fase1-cenoura');
									tipo = 'cenoura';
								} else if (sementeSelecionada === 'tomate') {
									celula.classList.add('plantado-tomate', 'fase1-tomate');
									tipo = 'tomate';
								} else if (sementeSelecionada === 'alface') {
									celula.classList.add('plantado-alface', 'fase1-alface');
									tipo = 'alface';
								}
								estadoPlantas[celula.id] = { fase: 1, regada: false, semAgua: 0, tipo: tipo };
								
								// Subtrair semente
								sementes[sementeSelecionada]--;
								atualizarIndicadores();
								return;
							}
			// Selecionar célula plantada
			if (
				celula.classList.contains('plantado-cenoura') ||
				celula.classList.contains('plantado-tomate') ||
				celula.classList.contains('plantado-alface')
			) {
				if (celulaSelecionada) celulaSelecionada.classList.remove('selecionada');
				celulaSelecionada = celula;
				celula.classList.add('selecionada');
				return;
			}
			
			// Colher planta pronta
			if (celula.classList.contains('pronta')) {
				const estado = estadoPlantas[celula.id];
				if (estado) {
					// Ganhar dinheiro baseado no tipo de planta
					let valor = 0;
					if (estado.tipo === 'cenoura') valor = 10;
					else if (estado.tipo === 'tomate') valor = 15;
					else if (estado.tipo === 'alface') valor = 8;
					
					dinheiro += valor;
					
					// Limpar célula - remover todas as classes de plantação
					celula.classList.remove(
						'pronta', 'selecionada', 'regada',
						'plantado-cenoura', 'plantado-tomate', 'plantado-alface',
						'fase1-cenoura', 'fase1-tomate', 'fase1-alface',
						'fase2-cenoura', 'fase2-tomate', 'fase2-alface',
						'fase3-cenoura', 'fase3-tomate', 'fase3-alface'
					);
					celula.classList.add('vazio');
					delete estadoPlantas[celula.id];
					
					if (celulaSelecionada === celula) {
						celulaSelecionada = null;
					}
					
					atualizarIndicadores();
				}
				return;
			}
		});
	}
}

// Botão de regar
document.getElementById('btn-regar').addEventListener('click', function() {
	// Alternar modo regar
	modoRegar = !modoRegar;
	
	// Desselecionar qualquer célula quando ativar modo regar
	if (modoRegar && celulaSelecionada) {
		celulaSelecionada.classList.remove('selecionada');
		celulaSelecionada = null;
	}
	
	atualizarIndicadores();
});

// Avançar tempo
document.getElementById('btn-avancar').addEventListener('click', function() {
	turno++;
	atualizarIndicadores();
	for (let i = 0; i < 12; i++) {
		for (let j = 0; j < 12; j++) {
			const celula = document.getElementById(`celula-${i}-${j}`);
			const estado = estadoPlantas[`celula-${i}-${j}`];
			if (!celula || !estado) continue;
			if (celula.classList.contains('morta')) continue;
			// Se regada, avança fase
			if (estado.regada) {
				estado.fase++;
				estado.regada = false;
				celula.classList.remove('regada');
				// Troca classe de fase
				celula.classList.remove('fase1-cenoura', 'fase1-tomate', 'fase1-alface', 'fase2-cenoura', 'fase2-tomate', 'fase2-alface', 'fase3-cenoura', 'fase3-tomate', 'fase3-alface');
				if (estado.fase === 2) {
					if (estado.tipo === 'cenoura') celula.classList.add('fase2-cenoura');
					if (estado.tipo === 'tomate') celula.classList.add('fase2-tomate');
					if (estado.tipo === 'alface') celula.classList.add('fase2-alface');
				} else if (estado.fase === 3) {
					if (estado.tipo === 'cenoura') celula.classList.add('fase3-cenoura');
					if (estado.tipo === 'tomate') celula.classList.add('fase3-tomate');
					if (estado.tipo === 'alface') celula.classList.add('fase3-alface');
				} else if (estado.fase > maxFase) {
					celula.classList.add('pronta');
				}
			} else {
				estado.semAgua++;
				if (estado.semAgua >= maxSemAgua) {
					celula.classList.remove(
						'fase1-cenoura', 'fase1-tomate', 'fase1-alface',
						'fase2-cenoura', 'fase2-tomate', 'fase2-alface',
						'fase3-cenoura', 'fase3-tomate', 'fase3-alface',
						'plantado-cenoura', 'plantado-tomate', 'plantado-alface',
						'pronta', 'regada', 'selecionada'
					);
					celula.classList.add('morta');
				}
			}
		}
	}
});

// Funcionalidades da loja
document.getElementById('comprar-cenoura').addEventListener('click', function() {
	if (dinheiro >= 5) {
		dinheiro -= 5;
		sementes.cenoura++;
		atualizarIndicadores();
	} else {
		alert('Dinheiro insuficiente!');
	}
});

document.getElementById('comprar-tomate').addEventListener('click', function() {
	if (dinheiro >= 7) {
		dinheiro -= 7;
		sementes.tomate++;
		atualizarIndicadores();
	} else {
		alert('Dinheiro insuficiente!');
	}
});

document.getElementById('comprar-alface').addEventListener('click', function() {
	if (dinheiro >= 4) {
		dinheiro -= 4;
		sementes.alface++;
		atualizarIndicadores();
	} else {
		alert('Dinheiro insuficiente!');
	}
});

// Botão de colher todas
document.getElementById('btn-colher-todas').addEventListener('click', function() {
	let totalColhido = 0;
	let dinheiroGanho = 0;
	let relatorio = { cenoura: 0, tomate: 0, alface: 0 };
	
	// Percorrer todas as células do grid
	for (let i = 0; i < 12; i++) {
		for (let j = 0; j < 12; j++) {
			const celula = document.getElementById(`celula-${i}-${j}`);
			if (!celula || !celula.classList.contains('pronta')) continue;
			
			const estado = estadoPlantas[celula.id];
			if (estado) {
				// Ganhar dinheiro baseado no tipo de planta
				let valor = 0;
				if (estado.tipo === 'cenoura') {
					valor = 10;
					relatorio.cenoura++;
				} else if (estado.tipo === 'tomate') {
					valor = 15;
					relatorio.tomate++;
				} else if (estado.tipo === 'alface') {
					valor = 8;
					relatorio.alface++;
				}
				
				dinheiroGanho += valor;
				totalColhido++;
				
				// Limpar célula - remover todas as classes de plantação
				celula.classList.remove(
					'pronta', 'selecionada', 'regada',
					'plantado-cenoura', 'plantado-tomate', 'plantado-alface',
					'fase1-cenoura', 'fase1-tomate', 'fase1-alface',
					'fase2-cenoura', 'fase2-tomate', 'fase2-alface',
					'fase3-cenoura', 'fase3-tomate', 'fase3-alface'
				);
				celula.classList.add('vazio');
				delete estadoPlantas[celula.id];
			}
		}
	}
	
	// Atualizar dinheiro
	dinheiro += dinheiroGanho;
	
	// Limpar seleção se alguma planta colhida estava selecionada
	if (celulaSelecionada && !document.getElementById(celulaSelecionada.id).classList.contains('pronta')) {
		celulaSelecionada = null;
	}
	
	// Mostrar relatório da colheita
	if (totalColhido > 0) {
		let mensagem = `Colheita realizada!\n\n`;
		mensagem += `Total de plantas colhidas: ${totalColhido}\n`;
		mensagem += `Dinheiro ganho: $${dinheiroGanho}\n\n`;
		mensagem += `Detalhes:\n`;
		if (relatorio.cenoura > 0) mensagem += `- Cenouras: ${relatorio.cenoura} ($${relatorio.cenoura * 10})\n`;
		if (relatorio.tomate > 0) mensagem += `- Tomates: ${relatorio.tomate} ($${relatorio.tomate * 15})\n`;
		if (relatorio.alface > 0) mensagem += `- Alfaces: ${relatorio.alface} ($${relatorio.alface * 8})\n`;
		
		alert(mensagem);
	} else {
		alert('Nenhuma planta pronta para colher!');
	}
	
	atualizarIndicadores();
});

