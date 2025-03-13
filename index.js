function toggleOdenisInputs() {
    var odenisTipi = document.getElementById('odenisTipi').value;
    var birdəfəlikOdenis = document.getElementById('birdəfəlikOdenis');
    var müddətliOdenis = document.getElementById('müddətliOdenis');

    if (odenisTipi === 'birdəfəlik') {
        birdəfəlikOdenis.style.display = 'block';
        müddətliOdenis.style.display = 'none';
    } else {
        birdəfəlikOdenis.style.display = 'none';
        müddətliOdenis.style.display = 'block';
    }
}
