
// Variável global para a semente selecionada
let sementeSelecionada = null;

// Seleção de semente
document.getElementById('btn-cenoura').addEventListener('click', function() {
	sementeSelecionada = 'cenoura';
});
document.getElementById('btn-tomate').addEventListener('click', function() {
	sementeSelecionada = 'tomate';
});
document.getElementById('btn-alface').addEventListener('click', function() {
	sementeSelecionada = 'alface';
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
		estadoPlantas[`celula-${i}-${j}`] = null;
		celula.addEventListener('click', function() {
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
		});
	}
}

// Botão de regar
document.getElementById('btn-regar').addEventListener('click', function() {
	if (celulaSelecionada && (
		celulaSelecionada.classList.contains('plantado-cenoura') ||
		celulaSelecionada.classList.contains('plantado-tomate') ||
		celulaSelecionada.classList.contains('plantado-alface')
	)) {
		celulaSelecionada.classList.add('regada');
		if (estadoPlantas[celulaSelecionada.id]) {
			estadoPlantas[celulaSelecionada.id].regada = true;
		}
	}
});

// Avançar tempo
document.getElementById('btn-avancar').addEventListener('click', function() {
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

