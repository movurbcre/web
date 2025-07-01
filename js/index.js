
function handleClick() {
    document.getElementById('image9').style.visibility = 'hidden';
    document.getElementById('baseImage').src = 'fotos/7.png';
    document.getElementById('image11').style.display = 'block';
  }
  
  function handleReverse() {
    document.getElementById('baseImage').src = 'fotos/8.png';
    document.getElementById('image9').style.visibility = 'visible';
    document.getElementById('image11').style.display = 'none';
  }
  
  function openPDF() {
    document.getElementById('pdfModal').style.display = 'flex';
  }
  
  function closePDF() {
    document.getElementById('pdfModal').style.display = 'none';
  }
  // Redirige al archivo entradaspubliftan.html cuando se hace clic en la imagen 3
function goToEntradas() {
  window.location.href = 'html/entradaspubliftan.html';
}
function goToParticipantesFta() {
  window.location.href = 'html/entradaspartiftan.html';
}
function closeInfoModal() {
  document.getElementById('infoModal').style.display = 'none';
}



