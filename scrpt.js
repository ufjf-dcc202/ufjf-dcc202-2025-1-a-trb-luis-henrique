
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

// Adiciona eventos a todas as células
for (let i = 0; i < 12; i++) {
	for (let j = 0; j < 12; j++) {
		const celula = document.getElementById(`celula-${i}-${j}`);
		if (!celula) continue;
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
				celula.classList.remove('preparado');
				if (sementeSelecionada === 'cenoura') {
					celula.classList.add('plantado-cenoura');
				} else if (sementeSelecionada === 'tomate') {
					celula.classList.add('plantado-tomate');
				} else if (sementeSelecionada === 'alface') {
					celula.classList.add('plantado-alface');
				}
				return;
			}
		});
	}
}

