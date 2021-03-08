//--------------------------------------------------------------------------------//
//------------ API FiSeverity - mapping the severity of forest fires  ------------//
//--------------------------------------------------------------------------------//
// Documentation: @github                                                         //
// Author: Yuri Tomaz Martins (yuritomazmartins@hotmail.com)                      //
// Application: FiSeverity can be used to assess and map the severity             //
// of forest fires to support stakeholders in fire management and prevention.     //
//--------------------------------------------------------------------------------//

// Parte 1: Ajustar a User-Interface UI
//ui.root.clear();
var mapPanel = ui.Map();
// ui.root.widgets().reset([mapPanel]);

//----------------------------------------------------------------------------------
// Note: The basemap darkstyle code is based on the project by Tianjia Liu.
var baseMap = require('users/yurigaufrrj/packages:darkMap.js')
mapPanel.drawingTools().setShown(false);
mapPanel.setOptions('Dark', { 'Dark': baseMap.darkTheme });
mapPanel.setControlVisibility({ layerList: true, zoomControl: false });
//----------------------------------------------------------------------------------

// Parte 2: Predefinições de estilo ------------------------------------------------
// Criar a coleção de cores
var colors = { 'orange': '#F67529', 'transparent': '#11ffee00', 'grey': '#F8F9FA' };

// Predefinir o estilo do título
var estilo_titulo = {
  margin: '14px 0px 0px 105px',
  fontWeight: 'bold',
  fontSize: '30px',
  //border: '1px solid silver',
  width: '200px',
  padding: '1px',
  textAlign: 'center',
  color: colors.orange,
  backgroundColor: colors.transparent,
};

// Predefinir o estilo do título de parágrafo
var paragrafo_titulo = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: 'black',
  padding: '1px',
  backgroundColor: colors.transparent,
};

// Predefinir o estilo texto (de paragrafo)
var estilo_paragrafo = {
  fontSize: '15px',
  fontWeight: '60',
  color: 'grey',
  padding: '1px',
  backgroundColor: colors.transparent,
};

// Predefinir o estilo de texto (de subparagrafo)
var estilo_subparagrafo = {
  fontSize: '13px',
  fontWeight: '50',
  color: '#9E9E9E',
  backgroundColor: colors.transparent,
};

// Criar a coleção de ícones 
var symbol = {
  polygon: '🔶',
  engine: '✅',
  pan: '🤚',
  fire: '🔥',
  info: 'ℹ️',
  reset1: '♻️',
  reset2: '♻',
  reset3: '🔄'
};

// Predefinir o estilo das bordas
var estilo_borda = '1px solid silver';

// Parte 3: Configurar a User-Interface e interação entre paineis -------------------
// Criar e predefinir o painel (da esquerda)
var mainPanel = ui.Panel({
  layout: ui.Panel.Layout.flow('vertical', true),
  style: {
    stretch: 'horizontal',
    height: '60%',
    width: '417px',
    backgroundColor: colors.grey,
    border: estilo_borda,
    position: 'top-left',
  }
});

// Usar um PainelDividido para possibilitar o autoajuste dos dois paineis
var splitPanel = ui.SplitPanel({
  firstPanel: mainPanel,
  secondPanel: mapPanel,
  orientation: 'horizontal',
  wipe: false,
  style: { stretch: 'both' }
});

// Definir o painelDividido como único na root
ui.root.widgets().reset([splitPanel]);

// Centralizar o 'mapPanel' na região (Portugal/Espanha)
mapPanel.setCenter(-2.50, 40.20, 6);

// Parte 4 - Criar o conteúdo do painel (da esquerda) ---------------------
// Adicionar o titulo do aplicativo no painel (da esquerda)
var tituloPrincipal1 = ui.Label('FiSeverity', estilo_titulo);
mainPanel.add(tituloPrincipal1);

// Adicionar descrição geral do objetivo no painel (da esquerda)
var descricao1_text =
  ' O aplicativo pode ser usado para avaliar e mapear ' +
  'a severidade dos incêndios florestais para apoiar ' +
  'as partes interessadas na gestão e prevenção de incêndios florestais.';
var descricaoRotulo1 = ui.Label(descricao1_text, estilo_paragrafo);
mainPanel.add(descricaoRotulo1);

// Adicionar descrição geral do produto usado no painel (da esquerda)
var descricao3_text =
  'Nota: A imagem de satélite utilizada é Sentinel-2 MSI Level-2A ' +
  ' e tem novas imagens a cada: 5 dias e resolução espacial de: 20 metros.';
var descricaoRotulo3 = ui.Label(descricao3_text, estilo_subparagrafo);
mainPanel.add(descricaoRotulo3);

// Adicionar hiperlink com o acesso a mais informações no painel (da esquerda)
var descricaolink_text =
  '+ Info';
var infourl = 'https://github.com/yuritmartins/burnseverity';
var descricaoRotulolink = ui.Label(descricaolink_text, estilo_paragrafo, infourl);
mainPanel.add(descricaoRotulolink);

// Adicionar título do primeiro processo de input no painel (da esquerda)
var tituloSecundario1 = 'Passo 1: Crie a área de interesse'
var descricaoRotulo4 = ui.Label(tituloSecundario1, paragrafo_titulo);
mainPanel.add(descricaoRotulo4);

// Parte 5: Passo 1. Criar evento para Desenhar a Área de Interesse -------------------- 
// Predefinir a drawingTools da User-Interface 
// https://developers.google.com/earth-engine/tutorials/community/drawing-tools-region-reduction
var drawingTools = mapPanel.drawingTools();
drawingTools.setShown(false);

// Predefinir o estilo da geometria criada
var dummyGeometry = ui.Map.GeometryLayer({ geometries: null, name: 'aoi_geometry', color: '#ff5c33' });

// Adicionar a geometria no 'layer manager' da User-Interface
drawingTools.layers().add(dummyGeometry);

// Desligar o modo desenho
drawingTools.setShape(null);

/*
  // Configurar a redução para evitar erro de memória/tempo limite
    var mapScale = Map.getScale();
    var scale = mapScale > 5000 ? mapScale * 2 : 5000;
*/

// Função para criar o desenho
var drawControl = ui.Button({
  label: symbol.polygon + ' Desenhar',
  onClick: drawPolygon,
});

// Função para Apagar o desenho
var resetControl = ui.Button({
  label: symbol.reset3 + ' Apagar',
  onClick: function () {
    clearGeometry()
  }
});

// Função para parar de desenhar
function panMove() {
  drawingTools.stop();
}

// Botão para ativar 'panMove'
var panControl = ui.Button({
  label: symbol.pan + ' Mover',
  onClick: function () {
    panMove()
  }
});

// Criar o agrupamento para desenhar
var groupDraw = ui.Panel({
  widgets: [drawControl, resetControl, panControl],
  layout: ui.Panel.Layout.flow('horizontal'),
  style: { position: 'top-left', height: '40px', padding: '0', margin: '0px 0 0 0', backgroundColor: colors.grey },
});

// Adicionar agrupamento no painel (da esquerda)
mainPanel.add(groupDraw);

// Parte 6: Continuaçao. Criar o conteúdo do painel (da esquerda) -----------------------
// Adicionar título do segundo processo de input no painel (da esquerda)
var tituloSecundario2 = 'Passo 2: Defina os dias dos intervalos'
var descricaoRotulo5 = ui.Label(tituloSecundario2, paragrafo_titulo);
mainPanel.add(descricaoRotulo5);

// Adicionar subparagrafo com instruções no painel (da esquerda)
var descricao4_text =
  'Nota: A busca pelas imagens de satélite usa o intervalo definido,' +
  ' caso não encontre imagens disponíveis aumente os dias.';
var descricaoRotulo6 = ui.Label(descricao4_text, estilo_subparagrafo);
//mainPanel.add(descricaoRotulo6);

// Parte 7: Passo 2. Criar evento para Inserir as Datas de Interesse no painel (da esquerda)---------------------
// Criar o input do intervalo Préfogo
// Adicionar título do input de intervalo Préfogo 
var tituloPrefogo = ui.Label({
  value: ' Intervalo Préfogo ',
  style: { fontSize: '16px', fontWeight: 'bold', padding: '6px 3px 0px 9px', margin: '0', backgroundColor: colors.grey }
});

// Adicionar barra de estilização
var centerDivider1 = ui.Label({
  value: ' | ',
  style: { color: 'd3d3d3', fontSize: '18px', padding: '5px 5px 0px 5px', margin: '0', backgroundColor: colors.grey }
});

// Adicionar a data Start-Prefire
var start_prefire = ui.Textbox({
  placeholder: 'YYYY-MM-DD',
  style: { fontSize: '', width: '110px', padding: '4px 0px 0px 5px', margin: '0', backgroundColor: colors.grey },
  onChange: function (value) {
    //pode personalizar
  }
});

// Adicionar divisor de datas
var dateDivider1 = ui.Label({
  value: 'Até',
  style: { fontSize: '12px', padding: '9px 0px 0px 5px', margin: '0', backgroundColor: colors.grey }
});

// Adicionar a data End-Prefire
var end_prefire = ui.Textbox({
  placeholder: 'YYYY-MM-DD',
  style: { fontSize: '', width: '110px', padding: '4px 0px 0px 5px', margin: '0', backgroundColor: colors.grey },
  onChange: function (value) {
    //pode personalizar
  }
});

// Criar o agrupamento e estilização do Pre-Fire
var groupPrefire = ui.Panel({
  widgets: [tituloPrefogo, centerDivider1, start_prefire, dateDivider1, end_prefire],
  layout: ui.Panel.Layout.flow('horizontal'),
  style: { position: 'top-left', height: '34px', padding: '0', margin: '10px 0px 0px 0px', backgroundColor: colors.grey },
});

// Criar o input do intervalo Pósfogo
// Adicionar título do input de intervalo Pósfogo 
var tituloPosfogo = ui.Label({
  value: ' Intervalo Pósfogo ',
  style: { fontSize: '16px', fontWeight: 'bold', padding: '6px 0px 0px 9px', margin: '0', backgroundColor: colors.grey }
});

// Adicionar barra de estilização
var centerDivider2 = ui.Label({
  value: '  | ',
  style: { color: 'd3d3d3', fontSize: '18px', padding: '4px 5px 0 5px', margin: '0', backgroundColor: colors.grey }
});

// Adicionar a data Start-Postfire
var start_postfire = ui.Textbox({
  placeholder: 'YYYY-MM-DD',
  style: { fontSize: '', width: '110px', padding: '4px 0px 0px 5px', margin: '0', backgroundColor: colors.grey },
  onChange: function (value) {
    //pode personalizar
  }
});

// Adicionar divisor de datas
var dateDivider2 = ui.Label({
  value: 'Até',
  style: { fontSize: '12px', padding: '9px 0px 0px 5px', margin: '0', backgroundColor: colors.grey }
});

// Adicionar a data End-Postfire
var end_postfire = ui.Textbox({
  placeholder: 'YYYY-MM-DD',
  style: { fontSize: '', width: '110px', padding: '4px 0px 0 5px', margin: '0', backgroundColor: colors.grey },
  onChange: function (value) {
    //pode personalizar
  }
});

// Criar o agrupamento e estilização do Post-Fire
var groupPostfire = ui.Panel({
  widgets: [tituloPosfogo, centerDivider2, start_postfire, dateDivider2, end_postfire],
  layout: ui.Panel.Layout.flow('horizontal'),
  style: { position: 'top-left', height: '34px', padding: '0', margin: '10px 0 0 0', backgroundColor: colors.grey },
});

// Inserir os grupos no painel (da esquerda)
mainPanel.add(groupPrefire);
mainPanel.add(groupPostfire);
mainPanel.add(descricaoRotulo6);

// Parte 8: Passo 3. Criar evento para executar a ferramenta no painel (da esquerda) ---------------------
// Adicionar título do processo para executar a ferramenta (da esquerda) 
var tituloSecundario3 = 'Passo 3: Execute a análise da severidade'
var descricaoRotulo7 = ui.Label(tituloSecundario3, paragrafo_titulo);
mainPanel.add(descricaoRotulo7);


// Criar o botão 'Executar'
var submit = ui.Button({
  label: symbol.engine + ' Executar',
  onClick: process // 'process' é o algoritmo de processamento do aplicativo
});

// Criar o botão 'Limpar API'
var resetAll = ui.Button({
  label: ' Limpar',
  onClick: function () {
    resetAPI()
  }
});

// Função para parar de desenhar //--------------------------------------------------------------------- PRECISA IMPLEMENTAR REBOOT API ou LIMPAR CHART+LAYERS
function resetAPI() {
  // inserir aqui --------------------------------------------------------------------------------------------------------------------------- implementar aqui
}

// Criar o agrupamento e estilização do 'Process'
var groupProcess = ui.Panel({
  widgets: [submit, resetAll],
  layout: ui.Panel.Layout.flow('horizontal'),
  style: { position: 'top-left', height: '40px', padding: '0', margin: '0px 0 0 0', backgroundColor: colors.grey },
});

// Inserir o grupo no painel (da esquerda)
mainPanel.add(groupProcess);

// Parte 9: Criar as funções do aplicativo ------------------------------
// Função para limpar 'drawingTools'
function clearGeometry() {
  var layers = drawingTools.layers();
  layers.get(0).geometries().remove(layers.get(0).geometries().get(0));
}

// Função para limpar geometria e ativar ferramenta 'draw' 
function drawPolygon() {
  clearGeometry();
  drawingTools.setShape('polygon');
  drawingTools.draw();
}

// Função para consultar imagens Sentinel-2
function consult_sen(start, end, aoi, cloud) {
  //input/entradas:
  //start = data início
  //end = data fim
  //aoi = área de interesse
  //cloud = máximo de nuvem na imagem

  // Criar a 'ImageCollection' da coleção Sentinel-2 Level2A (com correção atmosférica)
  var ImCol = 'COPERNICUS/S2_SR'
  var imagery = ee.ImageCollection(ImCol);
  var IMGSentinel = ee.ImageCollection(imagery
    .filterDate(start, end)
    .filterBounds(aoi)
    .map(maskS2sr))
    .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', cloud));
  //.median());

  //------------------------------------------------ Creditos: UN-SPIDER(ONU) - Inicio
  // Função para máscara de nuvem pela banda de qualidade do pixel do Sentinel-2
  function maskS2sr(image) {

    // Selecionar o pixel 'QA band'
    var qa = image.select('QA60');

    // Bits 10 são 'nuvens' e 11 são 'cirrus'
    var cloudBitMask = ee.Number(1).pow(10).int();
    var cirrusBitMask = ee.Number(1).pow(11).int();

    // Todos devem ser definidos como (0), indicando condições claras.
    var mask = qa.bitwiseAnd(cloudBitMask).eq(0)
      .and(qa.bitwiseAnd(cirrusBitMask).eq(0));

    // Retornar a 'image' mascarada
    return image.updateMask(mask)//.divide(10000);    //erro na implementação do '.divide(10000);'
      .copyProperties(image, ["system:time_start"]);
  }
  //------------------------------------------------ Creditos: UN-SPIDER(ONU) - Fim

  // Aplicar a máscara nas imagens Sentinel-2A
  var SentinelFiltro = IMGSentinel.map(maskS2sr);
  var SentinelClip = SentinelFiltro.mosaic().clip(aoi);

  // Gerar o mosaico com imagens Sentinel-2A entre as datas
  return SentinelClip
}

// Parte 10: Criar os processos do aplicativo ------------------------------
// Criar a função com o processo principal do aplicativo
function process() {
  // Selecionar as entradas com as configurações do usuário na User-Interface
  var aoi = drawingTools.layers().get(0).getEeObject();
  var start_preF = start_prefire.getValue();
  var end_preF = end_prefire.getValue();
  var start_postF = start_postfire.getValue();
  var end_postF = end_postfire.getValue();

  // Consultar as imagens Sentinel-2A
  var SentinelClip_pre = consult_sen(start_preF, end_preF, aoi, 20);
  var SentinelClip_post = consult_sen(start_postF, end_postF, aoi, 20);

  // Calcular o NBR = (NIR-SWIR2) / (NIR+SWIR2)
  var pre_nbr = SentinelClip_pre.normalizedDifference(['B8', 'B12']);
  var post_nbr = SentinelClip_post.normalizedDifference(['B8', 'B12']);

  // Calcular dNBR (índice de severidade)
  var dNBR_unscaled = pre_nbr.subtract(post_nbr);
  var dNBR = dNBR_unscaled.multiply(1000);

  // Gerar as saídas no 'layer manager' na User-Interface
  mapPanel.addLayer(aoi, {
    color: '#ff5c33',
    strokeWidth: 5,
    transparent: 70
  },
    'Área de Interesse');

  mapPanel.addLayer(SentinelClip_pre, {
    max: 2000,
    min: 0.0,
    gama: 1.5,
    bands: ['B4', 'B3', 'B2']
  },
    'Imagem Sentinel 2 RGB PréFogo', false);

  mapPanel.addLayer(SentinelClip_post, {
    max: 2000,
    min: 0.0,
    gamma: 1.5,
    bands: ['B4', 'B3', 'B2']
  },
    'Imagem Sentinel 2 RGB PósFogo', false);

  mapPanel.addLayer(pre_nbr, {
    max: 2,
    min: 0,
    gamma: 1.0,
    bands: ['nd']
  },
    'NBR PréFogo', false);

  mapPanel.addLayer(post_nbr, {
    max: 2,
    min: 0,
    gamma: 1.0,
    bands: ['nd']
  },
    'NBR PósFogo', false);

  mapPanel.addLayer(dNBR, {
    max: 1000,
    min: -1000,
    palette: ['white', 'black']
  },
    'dNBR escala-cinza', false);

  // Criar as classes de severidade para o dNBR (classificado)
  var sld_intervals =
    '<RasterSymbolizer>' +
    '<ColorMap type="intervals" extended="false" >' +
    '<ColorMapEntry color="#d7dbdd" quantity="-500" label="Sem Dados"/>' +
    '<ColorMapEntry color="#7a8737" quantity="-250" label="Alta Regeneração" />' +
    '<ColorMapEntry color="#acbe4d" quantity="-100" label="Baixa Regeneração" />' +
    '<ColorMapEntry color="#0ae042" quantity="100" label="Não Queimada" />' +
    '<ColorMapEntry color="#fff70b" quantity="270" label="Baixa Severidade" />' +
    '<ColorMapEntry color="#ffaf38" quantity="440" label="Moderada-Baixa Severidade" />' +
    '<ColorMapEntry color="#ff641b" quantity="660" label="Moderada-Alta Severidade" />' +
    '<ColorMapEntry color="#a41fd6" quantity="2000" label="Alta Severidade" />' +
    '</ColorMap>' +
    '</RasterSymbolizer>';

  // Adicionar o dNBR classificado no 'layer manager'
  mapPanel.addLayer(dNBR.sldStyle(sld_intervals), {}, 'dNBR classificado');

  // Limpar a edição de geometria (para dar destaque as saídas no 'layer manager')
  clearGeometry();
  // Desativar o modo desenho
  drawingTools.stop();

  // Exportar os produtos da análise
  // Exportar o dNBR (tipo .TIFF)
  Export.image.toDrive({
    image: dNBR,
    description: 'Export_dNBR',
    scale: 10,
    fileNamePrefix: 'Export_dNBR',
    region: aoi,
    maxPixels: 1e10
  });

  // Exportar a Área de Interesse (tipo .KML)
  var feature = ee.FeatureCollection([ee.Feature(aoi)]);
  Export.table.toDrive({
    collection: feature,
    description: 'Export_AOI',
    fileFormat: 'KML'
  });

  // Configurar a User-Interface após ativar o 'Executar'
  mapPanel.centerObject(aoi);
  //mapPanel.setOptions('HYBRID');



















 //------------------------------------------------------------------------------------------------------------------------------ EXPERIMENTACAO



  // Criar o painel do Chart
  var chartPanel = ui.Panel({
    style: {
      height: '200px',
      width: '225px',
      position: 'bottom-right',
      shown: true
    }
  });
  mapPanel.add(chartPanel);

  var total = ee.ImageCollection([dNBR]).mosaic()
  var labelsChart = [
    '1-Alta Regeneração',
    '2-Baixa Regeneração',
    '3-Não Queimada',
    '4-Baixa Severidade',
    '5-Moderada-Baixa Severidade',
    '6-Moderada-Alta Severidade',
    '7-Alta Severidade'
  ];
  print(total, 'Total Printado')
  var areaClass = total.eq([1, 2, 3, 4, 5, 6, 7]).rename(labelsChart);
  var areaClass2 = total.eq([1, 2, 3, 4, 5, 6, 7])//.rename(labelsChart);
  print(areaClass, 'areaClass Printado com name')
  print(areaClass2, 'areaClass Printado sem nome')
  var areaEstimate = areaClass.multiply(ee.Image.pixelArea()).divide(10000);
  var areaEstimate2 = areaClass2.multiply(ee.Image.pixelArea()).divide(10000);
  print(areaEstimate, 'areaEstimate Printado')
  //function chartAreaByClass() {
    // Make the chart panel visible the first time a geometry is drawn.
    //if (!chartPanel.style().get('shown')) {
    //  chartPanel.style().set('shown', true);
    //}
    // Get the drawn geometry; it will define the reduction region.
    //var aoi = drawingTools.layers().get(0).getEeObject();
    // Set the drawing mode back to null; turns drawing off.
    //drawingTools.setShape(null);
    // Reduction scale is based on map scale to avoid memory/timeout errors.
    //var mapScale = Map.getScale();
    //var scale = mapScale > 5000 ? mapScale * 2 : 5000;
      
    // The original tutorial charts NDVI time series.
    // Here, I created a chart showing area size by class for the polygon.

    var chart = ui.Chart.image
    .regions({
      image: areaEstimate,
      regions: aoi,
      reducer: ee.Reducer.count(),
      scale: 30,
    })
    .setChartType('PieChart').setOptions({
      width: 230,
      height: 170,
      title: 'Area por Classe (ha)',
      is3D: true,
      colors: ([
        '#7a8737', // (1) Alta Regeneração
        '#acbe4d', // (2) Baixa Regeneração
        '#0ae042', // (3) Não Queimada
        '#fff70b', // (4) Baixa Severidade
        '#ffaf38', // (5) Moderada-Baixa Severidade
        '#ff641b', // (6) Moderada-Alta Severidade
        '#a41fd6'  // (7) Alta Severidade
      ]),
    });
    // Replace the existing chart in the chart panel with the new chart.
    chartPanel.widgets().reset([chart]);
  //}

}









/*
// Seperate result into 8 burn severity classes
var thresholds = ee.Image([-1000, -251, -101, 99, 269, 439, 659, 2000]);
var classified = dNBR.lt(thresholds).reduce('sum').toInt();

//==========================================================================================
//                              ADD BURNED AREA STATISTICS

// count number of pixels in entire layer
var allpix =  classified.updateMask(classified);  // mask the entire layer
var pixstats = allpix.reduceRegion({
  reducer: ee.Reducer.count(),               // count pixels in a single class
  geometry: aoi,
  scale: 30
  });
var allpixels = ee.Number(pixstats.get('sum')); // extract pixel count as a number


// create an empty list to store area values in
var arealist = [];

// create a function to derive extent of one burn severity class
// arguments are class number and class name
var areacount = function(cnr, name) {
 var singleMask =  classified.updateMask(classified.eq(cnr));  // mask a single class
 var stats = singleMask.reduceRegion({
  reducer: ee.Reducer.count(),               // count pixels in a single class
  geometry: aoi,
  scale: 30
  });
var pix =  ee.Number(stats.get('sum'));
var hect = pix.multiply(900).divide(10000);                // Landsat pixel = 30m x 30m --> 900 sqm
var perc = pix.divide(allpixels).multiply(10000).round().divide(100);   // get area percent by class and round to 2 decimals
arealist.push({Class: name, Pixels: pix, Hectares: hect, Percentage: perc});
};

// severity classes in different order
var labelsChart = [
  'Sem Dados',
  'Alta Regeneração',
  'Baixa Regeneração',
  'Não Queimada',
  'Baixa Severidade',
  'Moderada-Baixa Severidade',
  'Moderada-Alta Severidade',
  'Alta Severidade'
];

var paletteChart = [
  'd7dbdd', // (0) Sem Dados
  '7a8737', // (1) Alta Regeneração
  'acbe4d', // (2) Baixa Regeneração
  '0ae042', // (3) Não Queimada
  'fff70b', // (4) Baixa Severidade
  'ffaf38', // (5) Moderada-Baixa Severidade
  'ff641b', // (6) Moderada-Alta Severidade
  'a41fd6'  // (7) Alta Severidade
];

// execute function for each class
for (var i = 0; i < 7; i++) {
  areacount(i, labelsChart[i]);
  }

print('Burned Area by Severity Class', arealist, '--> click list objects for individual classes');

  // Criar o painel do Chart
  var chartPanel = ui.Panel({
    style: {
      height: '200px',
      width: '225px',
      position: 'bottom-right',
      shown: true
    }
  });
  mapPanel.add(chartPanel);

  var areaClass = allpix.eq([-1000, -251, -101, 99, 269, 439, 659, 2000]).rename(labelsChart)
  var areaEstimate = areaClass.multiply(ee.Image.pixelArea()).divide(10000)

  var chart = ui.Chart.image
  .regions({
    image: areaEstimate,
    regions: aoi,
    reducer: ee.Reducer.sum(),
    scale: 30,
  })
  .setChartType('PieChart').setOptions({
    width: 250,
    height: 350,
    title: 'Area by class (ha)',
    is3D: true,
    colors: paletteChart,
    //pieHole: 0.4
  });

  chartPanel.widgets().reset([chart])
*/





  //------------------------------------------------------------------------------------------------------------------------------ EXPERIMENTACAO  



  // Parte 12: Criar a Legenda com as classes dNBR (USGS) -------------------------
  //------------------------------------------------ Creditos: UN-SPIDER(ONU) - Inicio
  // Configurar a posição do painel (da legenda)
  var legend = ui.Panel({
    style: {
      position: 'bottom-right',
      padding: '8px 15px'
    }
  });

  // Criar o título no painel (da legenda)
  var legendTitle = ui.Label({
    value: 'Classes de Severidade',
    //dNBR Classes
    style: {
      fontWeight: 'bold',
      fontSize: '18px',
      margin: '0 0 4px 0',
      padding: '0'
    }
  });

  // Adicionar o título ao painel (da legenda)
  legend.add(legendTitle);

  // Criar e aplicar estilo na linha (Cor + Nome Classe)
  var makeRow = function (color, name) {

    // Criar o rótulo-caixa para receber as cores das classes dNBR
    var colorBox = ui.Label({
      style: {
        backgroundColor: '#' + color,
        // Usar 'padding' para definir a largura e altura da caixa
        padding: '8px',
        border: '1px solid black',
        margin: '0 0 4px 0'
      }
    });

    // Criar o rótulo com a descrição da classe
    var description = ui.Label({
      value: name,
      style: { margin: '0 0 4px 6px' }
    });

    // Gerar o painel Legenda com (caixa de cor + nome da classe)
    return ui.Panel({
      widgets: [colorBox, description],
      layout: ui.Panel.Layout.Flow('horizontal')
    });
  };

  // Predefinir a paleta com Cores de cada Classes de Severidade (modelo USGS)
  var palette = [
    'd7dbdd', 
    '7a8737', 
    'acbe4d', 
    '0ae042', 
    'fff70b', 
    'ffaf38', 
    'ff641b', 
    'a41fd6'
  ];

  // Predefinir os Nomes de cada Classe de Severidade (modelo USGS)
  var names = [
    'Sem Dados', 
    'Alta Regeneração', 
    'Baixa Regeneração', 
    'Não Queimada', 
    'Baixa Severidade',
    'Moderada-Baixa Severidade', 
    'Moderada-Alta Severidade', 
    'Alta Severidade'
  ];

  // Adicionar as Cores e os Nomes de cada Classes de Severidade (modelo USGS)
  for (var i = 0; i < 8; i++) {
    legend.add(makeRow(palette[i], names[i]));
  }

  // Adicionar Legenda ao mapa
  mapPanel.add(legend);
  //------------------------------------------------ Creditos: UN-SPIDER(ONU) - Fim





/* // RESIDUOS DE CODIGO //

  // Parte 11: Criar Chart com áreas mensuradas por classe  (evento 'process')
  // Criar o painel do Chart
  var chartPanel = ui.Panel({
    style: {
      height: '200px',
      width: '225px',
      position: 'bottom-right',
      shown: true
    }
  });
  mapPanel.add(chartPanel);



  //var dNBRChart = dNBR_unscaled.multiply(1000);
  var thresholdsChart = ee.Image([-1000, -251, -101, 99, 269, 439, 659, 2000]);
  var classifiedChart = dNBR.lt(thresholdsChart);//.reduce('sum').toInt();
  //print(thresholdsChart)

  // Criar as classificações para organização dos dados
  var total = ee.ImageCollection([classifiedChart]).mosaic();
  var paletteChart = [
    'd7dbdd', // (0) Sem Dados
    '7a8737', // (1) Alta Regeneração
    'acbe4d', // (2) Baixa Regeneração
    '0ae042', // (3) Não Queimada
    'fff70b', // (4) Baixa Severidade
    'ffaf38', // (5) Moderada-Baixa Severidade
    'ff641b', // (6) Moderada-Alta Severidade
    'a41fd6'  // (7) Alta Severidade
  ];

  var labelsChart = [
    'Sem Dados',
    'Alta Regeneração',
    'Baixa Regeneração',
    'Não Queimada',
    'Baixa Severidade',
    'Moderada-Baixa Severidade',
    'Moderada-Alta Severidade',
    'Alta Severidade'
  ];


  var viz = {
    min: 0,
    max: 7,
    palette: paletteChart,
    label: labelsChart 
  };
  //var mainVis = total.visualize(viz);


  // Estimar o cálculo de área para cada classe
  var areaClass = classifiedChart.select([0, 1, 2, 3, 4, 5, 6, 7]);
  //var areaClass = classifiedChart.select([0, 1, 2, 3, 4, 5, 6, 7]);//.rename(labelsChart).get(labeschar);
  //var areaClass = classifiedChart.eq([0, 1, 2, 3, 4, 5, 6, 7]);//.rename(labelsChart);
  //var areaClass = classifiedChart.select([0, 1, 2, 3, 4, 5, 6, 7]);//.rename(labelsChart);
  //var areaClass = classifiedChart.select([0, 1, 2, 3, 4, 5, 6, 7]).rename(labelsChart).palette(paletteChart); //, paletteChart
  //var areaClass = classifiedChart.rename(labelsChart);
  //var areaClass = classifiedChart.eq(['constant', 'constant_1', 'constant_2', 'constant_3', 'constant_4', 'constant_5', 'constant_6', 'constant_7']).rename(labelsChart);
  //var areaClass = classifiedChart.rename(labelsChart);
  //var areaClass = classifiedChart.lt(thresholdsChart).rename(labelsChart);
  //var areaClass = total.eq([1, 2, 3, 4, 5, 6]).rename(labels);
  var areaEstimate = areaClass.multiply(ee.Image.pixelArea()).divide(10000);
  //print(areaClass, 'areaclass')
  print(areaEstimate, 'areaEstimate')

  // Criar o Chart com as áreas estimadas por classe
  var chart = ui.Chart.image
    .regions({
      image: areaEstimate.select([1, 2, 3, 4, 5, 6, 7]),
      regions: aoi,
      reducer: ee.Reducer.sum(),
      scale: 20,
      //seriesProperty: 'label',
      //xLabels: labelsChart
    })

    //.setChartType('ColumnChart')
    .setChartType('PieChart') 
    .setOptions({
      width: 230,
      height: 170,
      title: 'Area por Classe (ha)',
      is3D: false,
      colors: ([
        '#7a8737', // (1) Alta Regeneração
        '#acbe4d', // (2) Baixa Regeneração
        '#0ae042', // (3) Não Queimada
        '#fff70b', // (4) Baixa Severidade
        '#ffaf38', // (5) Moderada-Baixa Severidade
        '#ff641b', // (6) Moderada-Alta Severidade
        '#a41fd6'  // (7) Alta Severidade
      ]),
      pieHole: 0.4
    });
  // Inserir o Chart no ChartPanel
  chartPanel.widgets().reset([chart])



  var chartPanel2 = ui.Panel({
    style: {
      height: '50px',
      width: '225px',
      position: 'bottom-right',
      shown: true
    }
  });

  mapPanel.add(chartPanel2, 'Área Ardida Total: 00.000 (ha)');


  var descricaoSoma_text =
    'Área Ardida: 00.000 (ha)';
  var descricaoRotuloSoma = ui.Label(descricaoSoma_text, estilo_paragrafo);
  chartPanel2.add(descricaoRotuloSoma);
*/