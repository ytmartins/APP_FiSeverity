// Software para Mapeamento da Severidade dos Incêndios Florestias //
// Ajustar o UI Padrão

ui.root.clear();
var mapPanel = ui.Map();
ui.root.widgets().reset([mapPanel]);

// Predefinições de cores
var colors = {'orange': '#ff751a','transparent':'#11ffee00', 'grey':'#F8F9FA'};

// Predefinição do estilo do título
var estilo_titulo = {
    fontWeight: 'bold',
    fontSize: '30px',
    padding: '1px',
    color: colors.orange,
    backgroundColor: colors.transparent,
};

// Predefinição do estilo do paragrafo de título
var paragrafo_titulo = {
    fontSize: '18px',
    fontWeight: 'bold',
    color: 'black',
    padding: '1px',
    backgroundColor: colors.transparent,
};

// Predefinição do estilo de paragrafo texto normal
var estilo_paragrafo = {
    fontSize: '15px',
    fontWeight: '60',
    color: 'grey',
    padding: '1px',
    backgroundColor: colors.transparent,
};

// Predefinição do estilo de subparagrafo
var estilo_subparagrafo = {
    fontSize: '13px',
    fontWeight: '50',
    color: '#9E9E9E',
    backgroundColor: colors.transparent,
};

// Predefinições do estilo de borda
var estilo_borda = '1px solid rgba(205, 205, 205, 10.5)';

// Criar definições do painel principal (esquerda)
  var mainPanel = ui.Panel({
    layout: ui.Panel.Layout.flow('vertical', true),
    style: {
      stretch: 'horizontal',
      height: '60%',
      width: '400px',
      backgroundColor: colors.grey,
      border: estilo_borda,
      position: 'top-left',
    }
  });

// Adicione o titulo da ferramenta no painel principal (esquerda)
 var tituloPrincipal1 = ui.Label('Mapeamento > Incêndios Florestais > índice dNBR', estilo_titulo);
 mainPanel.add(tituloPrincipal1);

// Adicione descrição no painel principal (esquerda)
 var descricao1_text =
        'O aplicativo utiliza o Normalized Burn Ratio (NBR) para' +
        ' comparar o antes e o depois do fogo e gerar o índice dNBR.' +
        ' Os resultados apoiam de relatórios de danos na vegetação' + 
        ' e base de dados sobre os fogos florestais.';
    var descricaoRotulo1 = ui.Label(descricao1_text, estilo_paragrafo);
    mainPanel.add(descricaoRotulo1);

// Adicione descrição no painel principal (esquerda)     
 var descricao2_text = 
        'O dado tipo raster gerado (.TIFF) pode ser importado em SIG para criar mapas.' +
        ' A análise espacial da serveridade pode ser baixada em .CSV, .SVG e .PNG.';
    var descricaoRotulo2 = ui.Label (descricao2_text, estilo_paragrafo);
    mainPanel.add(descricaoRotulo2);

// Adicione descrição no painel principal (esquerda)
var descricao3_text = 
        'A imagem de satélite utilizada é Sentinel-2 MSI Level-2A (com correção atmosférica)' +
        ' com novas imagens a cada: 5 dias, resolução espacial: 10 metros.';
    var descricaoRotulo3 = ui.Label (descricao3_text, estilo_paragrafo);
    mainPanel.add(descricaoRotulo3);

// Adicione hiperlink para obter mais informações da ferramenta no painel principal (esquerda)
var infourl = 'https://github.com/yuritmartins/burnseverity'
var descricaolink_text = 
    '+ Info';
var descricaoRotulolink = ui.Label (descricaolink_text, estilo_paragrafo, infourl);
mainPanel.add(descricaoRotulolink);

// Adicione título do primeiro passo da ferramenta no painel principal (esquerda)
var tituloSecundario1 = 'Passo 1: Crie a área de interesse'
    var descricaoRotulo4 = ui.Label(tituloSecundario1, paragrafo_titulo);
  mainPanel.add(descricaoRotulo4);
  

///////////////////////////////////////////////////////////////////////////////
// Parte 1. Desenhar à geometria //////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
var drawingTools = mapPanel.drawingTools();
drawingTools.setShown(false);

// Configurações da geometria de estilo da geometria que será desenhada
var dummyGeometry = ui.Map.GeometryLayer({geometries: null, name: 'aoi_geometry', color: 'ff5c33'});

// Adicionar layer com parâmetros prédefinidos
drawingTools.layers().add(dummyGeometry);

// Defina o modo de desenho de volta para nulo; desliga o modo desenho
drawingTools.setShape(null);

// A escala de redução é baseada na escala do mapa para evitar erros de memória/tempo limite
var mapScale = Map.getScale();
var scale = mapScale > 5000 ? mapScale * 2 : 5000;  

// Simbolos para representação visual
var symbol = {
  polygon: '🔶',
  engine: '✅',
};

// Cria o botão e o evento para desenhar geometria  
var controlPanel = ui.Button({
      label: symbol.polygon +' Desenhar Área de Interesse',
      onClick: drawPolygon,
    });

// Adicionar botão de desenho no painel principal
mainPanel.add(controlPanel);



//////////////////////////////////////////////////////////////////////////
// Descrição Painel Esquerdo: Formulário /////////////////////////////////
//////////////////////////////////////////////////////////////////////////

// Adicione título do segundo passo da ferramenta no painel principal (esquerda)
    var tituloSecundario2 = 'Passo 2: Defina as datas entre o incêndio'
    var descricaoRotulo5 = ui.Label(tituloSecundario2, paragrafo_titulo);
    mainPanel.add(descricaoRotulo5);

// Adicione descrição no painel principal (esquerda)
    var descricao4_text = 
      'O aplicativo busca as imagens de satélite entre os intervalos definidos.' +
      ' Caso não encontre imagens, aumente o intervalo.';
    var descricaoRotulo6 = ui.Label(descricao4_text, estilo_subparagrafo);
    mainPanel.add(descricaoRotulo6);



///////////////////////////////////////////////////////////////////////////
// Configuração do evento: Passo 2. Inserir as datas para buscar imagens //
///////////////////////////////////////////////////////////////////////////

  //Título separador de input de data (Start - Prefire)
    var descricaoStartDataPrefogo_text = 
        'Insira a Data do Início (Préfogo):';
    var descricaoStartPrefogoRotulo = ui.Label (descricaoStartDataPrefogo_text, estilo_paragrafo);

  // Crie campo para inserir a data do INICIO do intervalo PRÉFOGO 
    var start_prefire = ui.Textbox({
        value: '',
        placeholder: 'YYYY-MM-DD',
    });

  //Título separador de input de data (End - Prefire)
    var descricaoEndDataPrefogo_text = 
        'Insira a Data do Fim (Préfogo):';
    var descricaoEndPrefogoRotulo = ui.Label (descricaoEndDataPrefogo_text, estilo_paragrafo);

  // Crie campo para inserir a data do FINAL do intervalo PRÉFOGO  
    var end_prefire = ui.Textbox({
        value: '',
        placeholder: 'YYYY-MM-DD',
    });

  // Adicione título dos dados de entrada PÓSFOGO
    var descricaoStartDataPosfogo_text = 
        'Insira a Data do Início (Pósfogo):';
    var descricaoStartPosfogoRotulo = ui.Label (descricaoStartDataPosfogo_text, estilo_paragrafo);

  // Crie campo para inserir a data do INICIO do intervalo PÓSFOGO
    var start_postfire = ui.Textbox({
        value: '',
        placeholder: 'YYYY-MM-DD',
    });

  // Adicione título dos dados de entrada PÓSFOGO
    var descricaoEndDataPosfogo_text = 
      'Insira a Data do Fim (Pósfogo):';
    var descricaoEndPosfogoRotulo = ui.Label (descricaoEndDataPosfogo_text, estilo_paragrafo);

  // Crie campo para inserir a data do FINAL do intervalo PÓSFOGO
    var end_postfire = ui.Textbox({
        value: '',
        placeholder: 'YYYY-MM-DD',
    });

  // Adicionar os campos no painel principal (esquerda)
    mainPanel.add (descricaoStartPrefogoRotulo);
    mainPanel.add (start_prefire);
    mainPanel.add (descricaoEndPrefogoRotulo)
    mainPanel.add (end_prefire);
    mainPanel.add (descricaoStartPosfogoRotulo);
    mainPanel.add (start_postfire);
    mainPanel.add (descricaoEndPosfogoRotulo);
    mainPanel.add (end_postfire);

// Use um PainelDividido para que seja possível autoajuste dos dois paineis
var splitPanel = ui.SplitPanel({
    firstPanel: mainPanel,
    secondPanel: mapPanel,
    orientation: 'horizontal',
    wipe: false,
    style: {stretch: 'both'}
});

// Defina o painelDividido como único na root
ui.root.widgets().reset([splitPanel]); 
// Centrarlizar o painel do mapa na região (Portugal/Espanha)
mapPanel.setCenter (-2.50,40.20,6);

// Crie o botão 'Executar'
var submit = ui.Button({
  label: symbol.engine + ' Executar dNBR',
  onClick: process
})

mapPanel.add(submit);

///////////////////////////////////////////////////////////
// Processamento da análise começa aqui

//functions:

// Função para limpar edição de polígonos
function clearGeometry(){
  var layers = drawingTools.layers();
  layers.get(0).geometries().remove(layers.get(0).geometries().get(0));
}

// Função para limpar geometria e ativar ferramenta 
function drawPolygon(){
  clearGeometry();
  drawingTools.setShape('polygon');
  drawingTools.draw();
}

//Function to consult sentinel-2 images
function consult_sen(start,end,aoi,cloud) {
  //input:
  //start = start date
  //end = end date
  //aoi = area of interest
  //cloud = cloud max in image

//ImageCollection Sentinel-2 Level2A
var ImCol = 'COPERNICUS/S2_SR'
var imagery = ee.ImageCollection(ImCol);
  var IMGSentinel = ee.ImageCollection (imagery // Level-2A correction atmosferic
    .filterDate (start, end)
    .filterBounds (aoi)
    .map(maskS2sr))
    .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', cloud));
    //.median());
 
  //Credit: UN-SPIDER(ONU) start
  // Function to mask clouds from the pixel quality band of Sentinel-2 SR data.
  function maskS2sr(image) {
  
  // Get the pixel QA band.
  var qa = image.select('QA60');

  // Bits 10 and 11 are clouds and cirrus, respectively.
  var cloudBitMask = ee.Number(1).pow(10).int();
  var cirrusBitMask = ee.Number(1).pow(11).int();

  // All flags should be set to zero, indicating clear conditions.
  var mask = qa.bitwiseAnd(cloudBitMask).eq(0)
      .and(qa.bitwiseAnd(cirrusBitMask).eq(0));
  // Return the masked image, scaled to TOA reflectance, without the QA bands.
  return image.updateMask(mask)//.divide(10000);    //erro na implementação do '.divide(10000);'
      .copyProperties(image, ["system:time_start"]);
  } //Credit: UN-SPIDER(ONU) end
 

  //Aplica a máscara de nuvem
  var SentinelFiltro = IMGSentinel.map(maskS2sr); 
  var SentinelClip = SentinelFiltro.mosaic().clip(aoi);
 

  //Output
  //mosaic sentinel-2A image between dates
  return SentinelClip  
}



// Processos
function process() {
  //inputs
  var aoi = drawingTools.layers().get(0).getEeObject();
  var start_preF = start_prefire.getValue();
  var end_preF = end_prefire.getValue();
  var start_postF = start_postfire.getValue();
  var end_postF = end_postfire.getValue();

  //sentinel consults
  var SentinelClip_pre = consult_sen(start_preF, end_preF, aoi, 20);
  var SentinelClip_post = consult_sen(start_postF, end_postF, aoi, 20);

  //Procedimentos NBR = (NIR-SWIR2) / (NIR+SWIR2)
  var pre_nbr = SentinelClip_pre.normalizedDifference(['B8', 'B12']);
  var post_nbr = SentinelClip_post.normalizedDifference(['B8', 'B12']);

  //Cálculo dNBR
  var dNBR_unscaled = pre_nbr.subtract(post_nbr); //
  var dNBR = dNBR_unscaled.multiply(1000);

  //Outputs
  mapPanel.addLayer(aoi,{
    color: 'ff5c33',
    strokeWidth: 5,
    transparent: 70}, 
    'Area of Interest');

  mapPanel.addLayer(SentinelClip_pre, {
    max: 2000,
    min: 0.0,
    gama: 1.5,
    bands: ['B4', 'B3', 'B2']},
    'Imagem Sentinel 2 RGB PreFire');

  mapPanel.addLayer(SentinelClip_post, {
    max: 2000,
    min: 0.0,
    gamma: 1.5,
    bands: ['B4', 'B3', 'B2']},
    'Imagem Sentinel 2 RGB PostFire');

  mapPanel.addLayer(pre_nbr, {
    max: 2,
    min: 0,
    gamma: 1.0,
    bands: ['nd']},
    'nbr pre');

  mapPanel.addLayer(post_nbr,{
    max: 2,
    min: 0,
    gamma: 1.0,
    bands: ['nd']},
    'nbr post');

  mapPanel.addLayer(dNBR,{
    max: 1000,
    min: -1000,
    palette: ['white', 'black']},
    'dNBR greyscale');


  // Define an SLD style of discrete intervals to apply to the image.
  var sld_intervals =
  '<RasterSymbolizer>' +
    '<ColorMap type="intervals" extended="false" >' +
      '<ColorMapEntry color="#ffffff" quantity="-500" label="-500"/>' +
      '<ColorMapEntry color="#7a8737" quantity="-250" label="-250" />' +
      '<ColorMapEntry color="#acbe4d" quantity="-100" label="-100" />' +
      '<ColorMapEntry color="#0ae042" quantity="100" label="100" />' +
      '<ColorMapEntry color="#fff70b" quantity="270" label="270" />' +
      '<ColorMapEntry color="#ffaf38" quantity="440" label="440" />' +
      '<ColorMapEntry color="#ff641b" quantity="660" label="660" />' +
      '<ColorMapEntry color="#a41fd6" quantity="2000" label="2000" />' +
    '</ColorMap>' +
  '</RasterSymbolizer>';
  
  mapPanel.addLayer(dNBR.sldStyle(sld_intervals), {}, 'dNBR classified');

  //cleaning edit polygon
  clearGeometry();

  //export layers
  Export.image.toDrive({
    image: dNBR,
    description: 'Export_dNBR', 
    scale: 10, 
    fileNamePrefix: 'Export_dNBR',
    region: aoi, 
    maxPixels: 1e10
  });

  var feature = ee.FeatureCollection([ee.Feature(aoi)]);
  Export.table.toDrive({
    collection: feature,
    description: 'Export_AOI',
    fileFormat: 'KML'
  });

  mapPanel.centerObject(aoi);
  mapPanel.setOptions('HYBRID');
}
 



// Legenda com as classes dNBR (USGS) //Credit: UN-SPIDER(ONU) start
// set position of panel
var legend = ui.Panel({
  style: {
    position: 'bottom-right',
    padding: '8px 15px'
  }});
 
// Create legend title
var legendTitle = ui.Label({
  value: 'dNBR Classes',
  style: {fontWeight: 'bold',
    fontSize: '18px',
    margin: '0 0 4px 0',
    padding: '0'
    }});
 
// Add the title to the panel
legend.add(legendTitle);
 
// Creates and styles 1 row of the legend.
var makeRow = function(color, name) {
 
      // Create the label that is actually the colored box.
      var colorBox = ui.Label({
        style: {
          backgroundColor: '#' + color,
          // Use padding to give the box height and width.
          padding: '8px',
          margin: '0 0 4px 0'
        }});
 
      // Create the label filled with the description text.
      var description = ui.Label({
        value: name,
        style: {margin: '0 0 4px 6px'}
      });
 
      // return the panel
      return ui.Panel({
        widgets: [colorBox, description],
        layout: ui.Panel.Layout.Flow('horizontal')
      })};
 
//  Palette with the colors
var palette =['7a8737', 'acbe4d', '0ae042', 'fff70b', 'ffaf38', 'ff641b', 'a41fd6'];
 
// name of the legend
var names = ['Alta Regeneração','Baixa Regeneração','Não Queimada', 'Baixa Severidade',
'Moderada-Baixa Severidade', 'Moderada-Alta Severidade', 'Alta Severidade'];
 
// Add color and and names
for (var i = 0; i < 7; i++) {
  legend.add(makeRow(palette[i], names[i]));
  }  
 
// add legend to map (alternatively you can also print the legend to the console)
mapPanel.add(legend); //Credit: UN-SPIDER(ONU) end























/*
///////////////////////////////////////////////////////////
// Processamento da análise começa aqui ///////////////////
///////////////////////////////////////////////////////////
// Crie o botão 'Executar'
var submit = ui.Button({
    label: symbol.engine + ' Executar dNBR',
    onClick: function() {
     mapPanel.clear()
     painelChart.clear()


// Defina área de estudo (AOI)
    //var AOI = ee.FeatureCollection(geometry);
    // Defina configurações da ferramenta
    //Map.style().set('cursor', 'hand');
    

// Defina as datas
    //var start_prefire = startPrefireDate.getValue(); //ee.Date.parse('YYYYMMDD', firstDate).format('YYYY-MM-DD').getInfo(); 
    var start_prefire = ee.Date.parse('YYYYMMDD', start_prefire).format('YYYY-MM-DD').getInfo(); 
    var end_prefire = endPrefireDate.getValue();
    var start_postfire = startPostfireDate.getValue();
    var end_postfire = endPostfireDate.getValue();

// Defina o limite de nuvem
    var cloud_threshold = 30;

// Configure uma função para calcular o dNBR
  function CalculatedNBR (image){
  var dNBR = image.normalizedDifference(['band_1','band_2']).rename('dNBR');
  return image.addBands(dNBR);
}
    
// Adicione TempoBanda
  function TimeBand (image){
  return image.addBands(image.metadata('system:time_start'));
}

// Função de máscara de nuvem usando Sentinel-2 QA band
function maskS2clouds(image){
    // Selecione a QA Band
    var qa = image.select('QA60');
    var cloudBitMask = ee.Number(2).pow(10).int(); // Bit 10 é nuvem geral
    var cirrusBitMask = ee.Number(2).pow(11).int(); // Bit 11 é cirrus
    var mask = qa.bitwiseAnd(cloudBitMask).eq(0).and(
               qa.bitwiseAnd(cirrusBitMask).eq(0))
    // Retorne a imagem mascarada sem nuvens
    return image.updateMask(mask)
    .copyProperties(image,["system:time_start"]);
}


// Selecione o Level da imagem Sentinel-2 (ImageCollection)
var ImCol = ee.ImageCollection("COPERNICUS/S2_SR") //Sentinel-2 Level2-A (com Correções Atmosféricas)
    .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', cloud_threshold))
    .sort('CLOUDY_PIXEL_PERCENTAGE')
    .sort('system:time_start')
    .filterBounds(AOI)
    .map(maskS2clouds)
    .map(CalculatedNBR)
    .map(TimeBand);

    var nbr_images = ImCol.size().getInfo();

// Selecione a imagem pelo ImageCollection
var imagery = ee.ImageCollection(ImCol);
var prefireImCol = ee.ImageCollection(imagery
    .filterDate(start_prefire, end_prefire)
    .filterBounds(AOI));
var postfireImCol = ee.ImageCollection(imagery
    .filterData(start_postfire, end_postfire)
    .filterBounds (AOI));
print("Pré-fogo Coleção de Imagens: ", prefireImCol);
print("Pós-fogo Coleção de Imagens", postfireImCol);

// Crie mosaico das imagens com corte para área de estudo
var pre_mos = prefireImCol.mosaic().clip(AOI);
var post_mos = postfireImCol.mosaic().clip(AOI);

var pre_cm_mos = prefire_CM_ImCol.mosaic().clip(AOI);
var post_cm_mos = postfire_CM_ImCol.mosaic().clip(AOI);

// Formula cálculo: NBR = (NIR-SWIR2) / (NIR+SWIR2)
var preNBR = pre_cm_mos.normalizedDifference(['B8', 'B12']);
var postNBR = post_cm_mos.normalizedDifference(['B8','B12']);

// Adicione parâmetros de visualização de imagens em cores verdadeiras
var vis = {bands: ['B4', 'B3', 'B2'], max: 2000, gamma: 1.5};

// Adicione Layers ao mapa
Map.addLayer(AOI.draw({color:'FF5733', strokeWidth: 5}), {},'Área de Estudo');
Map.addLayer(pre_mos, vis, 'Pré-fogo imagem');
Map.addLayer(post_mos, vis, 'Pós-Fogo imagem');
Map.addLayer(pre_cm_mos, vis, 'Pré-fogo imagem - máscara de nuvem');
Map.addLayer(post_cm_mos, vis, 'Pós-fogo imagem - máscara de nuvem');

// Imagem alta resolução Google
Map.setOptions('satellite');

var dnbrGrey = ['white', 'black'];
Map.addLayer(dNBR, {min: -1000, max: 1000, palette: dnbrGrey}, 'dNBR - escala cinza');

// Reclassificação do dNBR
var sld_intervals =
  '<RasterSymbolizer>' +
    '<ColorMap type="intervals" extended="false" >' +
      '<ColorMapEntry color="#ffffff" quantity="-500" label="-500"/>' +
      '<ColorMapEntry color="#7a8737" quantity="-250" label="-250" />' +
      '<ColorMapEntry color="#acbe4d" quantity="-100" label="-100" />' +
      '<ColorMapEntry color="#0ae042" quantity="100" label="100" />' +
      '<ColorMapEntry color="#fff70b" quantity="270" label="270" />' +
      '<ColorMapEntry color="#ffaf38" quantity="440" label="440" />' +
      '<ColorMapEntry color="#ff641b" quantity="660" label="660" />' +
      '<ColorMapEntry color="#a41fd6" quantity="2000" label="2000" />' +
    '</ColorMap>' +
  '</RasterSymbolizer>';

// Adicione o dNBR no mapa com intervalo classificado (escala USGS-EUA)
Map.addLayer(dNBR.sldStyle(sld_intervals), {}, 'dNBR Classificado');

// Crie a chart do dNBR
//var dnbrChart = ui.Chart.image.
  }
});

// Adiciona o botão 'Executar' no painel principal
mainPanel.add(submit)












///////////////////////////////////////////////////////////
// UI PAINEL DIREITO - LEGENDA ////////////////////////////
///////////////////////////////////////////////////////////

//Criação da rampa de cores
var layerProperties = {   'Magnitude of change': {
    name: 'slope',
    visParams: {min: 1, max: 7, palette: ['7a8737', 'acbe4d', '0ae042', 'fff70b', 'ffaf38', 'ff641b', 'a41fd6']},
    legend: [
      {'Alta Regeneração': '7a8737'}, {'Baixa Regeneração': 'acbe4d'}, {'Área Não Queimada': '0ae042'},
      {'Baixa Severidade': 'fff70b'},{'Moderada-Baixa Severidade': 'ffaf38'},
      {'Moderada-Alta Severidade': 'ff641b'}, {'Alta Severidade': 'a41fd6'},
    ],
    
    defaultVisibility: false
  }
};

// Add a title and some explanatory text to a side panel.
var header = ui.Label('Resultados > Análise dos Dados', {fontSize: '18px', color: 'black',fontWeight: 'bold', });


var toolPanel = ui.Panel([header], 'flow', {width: '350px', border:estilo_borda, });
ui.root.widgets().add(toolPanel);

// Create a layer selector pulldown.
// The elements of the pulldown are the keys of the layerProperties dictionary.
var selectItems = Object.keys(layerProperties);

// Define the pulldown menu.  Changing the pulldown menu changes the map layer
// and legend.
var layerSelect = ui.Select({
  items: selectItems,
  value: selectItems[0],
  onChange: function(selected) {
    // Loop through the map layers and compare the selected element to the name
    // of the layer. If they're the same, show the layer and set the
    // corresponding legend.  Hide the others.
    mapPanel.layers().forEach(function(element, index) {
      element.setShown(selected == element.getName());
    });
    setLegend(layerProperties[selected].legend);
  }
});

// Create the legend.
// Define a panel for the legend and give it a tile.
var legendPanel = ui.Panel({
  style:
      {fontWeight: 'bold', fontSize: '12px', margin: '0 0 0 8px', padding: '0'}
});
toolPanel.add(legendPanel);

var legendTitle = ui.Label(
    'Legenda',
    {fontWeight: 'bold', fontSize: '15px', margin: '0 0 4px 0', padding: '0', color: 'black', });
legendPanel.add(legendTitle);

// Define an area for the legend key itself.
// This area will be replaced every time the layer pulldown is changed.
var keyPanel = ui.Panel();
legendPanel.add(keyPanel);

function setLegend(legend) {
  // Loop through all the items in a layer's key property,
  // creates the item, and adds it to the key panel.
  keyPanel.clear();
  for (var i = 0; i < legend.length; i++) {
    var item = legend[i];
    var name = Object.keys(item)[0];
    var color = item[name];
    var colorBox = ui.Label('', {
      backgroundColor: color,
      // Use padding to give the box height and width.
      padding: '8px',
      margin: '0'
    });
    // Create the label with the description text.
    var description = ui.Label(name, {margin: '0 0 4px 6px'});
    keyPanel.add(
        ui.Panel([colorBox, description], ui.Panel.Layout.Flow('horizontal')));
  }
}

// Set the initial legend.
setLegend(layerProperties[layerSelect.getValue()].legend);






///////////////////////////////////////////////////////////
// UI PAINEL DIREITO - LEGENDA  ///////////////////////////
///////////////////////////////////////////////////////////

var chartPanel = ui.Panel({
    layout: ui.Panel.Layout.flow('vertical', true),
    style: {
      stretch: 'horizontal',
      height: '50%',
      width: '350px',
      backgroundColor: colors.transparent,
      position: 'bottom-right'
    }
  });
toolPanel.add(chartPanel);

var chartTitle = ui.Label(
    //'Cálculos Espaciais da Análise de Severidade',
    'Análise Espacial da Severidade do Incêndio',
    {fontWeight: 'bold', fontSize: '15px', margin: '0 0 4px 0', padding: '0',color: 'black'});
legendPanel.add(chartTitle);

var keyPanel1 = ui.Panel();
chartPanel.add(keyPanel1);

/*
///////////////////////////////////////////////////////////
// UI PAINEL DIREITO - CHART  /////////////////////////////
///////////////////////////////////////////////////////////

  //Define dates
  var start_prefire = startPrefireDate.getValue();
  var end_prefire = endPrefireDate.getValue();
  var start_postfire = startPostfireDate.getValue();
  var end_postfire = endPostfireDate.getValue();
  
//Setup a function to caclulate the NDSI
  function CalculateNDVI(image) {
    var NDVI = image.normalizedDifference(['B8', 'B4']).rename('NDVI');
    return image.addBands(NDVI);
        } 
  
  //Add a Time band.
  function TimeBand (image) {
  return image.addBands(image.metadata('system:time_start'));
}

// Function to mask clouds using the Sentinel-2 QA band.
function maskS2clouds(image) {
  var qa = image.select('QA60')

  // Bits 10 and 11 are clouds and cirrus, respectively.
  var cloudBitMask = 1 << 10;
  var cirrusBitMask = 1 << 11;

  // Both flags should be set to zero, indicating clear conditions.
  var mask = qa.bitwiseAnd(cloudBitMask).eq(0).and(
             qa.bitwiseAnd(cirrusBitMask).eq(0))

  // Return the masked and scaled data, without the QA bands.
  return image.updateMask(mask).divide(10000)
      .select("B.*")
      .copyProperties(image, ["system:time_start"])
}

  //Add Sentinel-2 Collection and filter using AOI, dates, cloud threshold.
  var S2 = ee.ImageCollection("COPERNICUS/S2_SR")
      .filterDate(start_prefire, end_prefire)
      .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 30))
      .sort('CLOUDY_PIXEL_PERCENTAGE')
      .sort('system:time_start')
      .filterBounds(AOI)
      .map(maskS2clouds) 
      .map(CalculateNDVI)
      .map(TimeBand)
      .select('NDVI');
print(S2, 'coll S2')
*/
// fim