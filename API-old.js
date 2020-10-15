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
        'Esta ferramenta calcula a severidade dos fogos florestais,' +
        ' os resultados podem apoiar a elaboração de relatórios' +
        ' e informações para estratégias preventivas.';
    var descricaoRotulo1 = ui.Label(descricao1_text, estilo_paragrafo);
    mainPanel.add(descricaoRotulo1);

// Adicione descrição no painel principal (esquerda)     
 var descricao2_text = 
        'Os dados gerados são o raster .TIFF para importar em SIG e gerar mapa,' +
        ' a análise espacial é gerada na execução e pode ser baixada em .CSV, .SVG e .PNG.';
    var descricaoRotulo2 = ui.Label (descricao2_text, estilo_paragrafo);
    mainPanel.add(descricaoRotulo2);

// Adicione descrição no painel principal (esquerda)
var descricao3_text = 
        'As imagens de satélite utilizadas são Sentinel-2(A&B):' +
        ' Imagens desde: Jun/2015, Resolução temporal: 5 dias, Resolução espacial: 10 metros. Acesso gratuito.';
    var descricaoRotulo3 = ui.Label (descricao3_text, estilo_paragrafo);
    mainPanel.add(descricaoRotulo3);

// Adicione hiperlink para obter mais informações da ferramenta no painel principal (esquerda)
var infourl = 'https://github.com/yuritmartins/burnseverity'
var descricaolink_text = 
    '+ Info';
var descricaoRotulolink = ui.Label (descricaolink_text, estilo_paragrafo, infourl);
mainPanel.add(descricaoRotulolink);

// Adicione título do primeiro passo da ferramenta no painel principal (esquerda)
var tituloSecundario1 = '1. Crie a área de estudo:'
    var descricaoRotulo4 = ui.Label(tituloSecundario1, paragrafo_titulo);
  mainPanel.add(descricaoRotulo4);
  






///////////////////////////////////////////////////////////////////////////////
// Configuração do evento: Passo 1. Desenhar à geometria //////////////////////
///////////////////////////////////////////////////////////////////////////////

    var drawingTools = mapPanel.drawingTools();
    drawingTools.setShown(false);
    while (drawingTools.layers().length() > 0) {
      var layer = drawingTools.layers().get(0);
      drawingTools.layers().remove(layer);
    }

    // Configurações da geometria de estilo da geometria que será desenhada
    var dummyGeometry =
        ui.Map.GeometryLayer({geometries: null, name: 'geometry', color: 'ff5c33'});

    // Adicionar layer com parâmetros prédefinidos
    drawingTools.layers().add(dummyGeometry);

    // Especificação da função para Limpar geometrias
    function clearGeometry() {
      var layers = drawingTools.layers();
      layers.get(0).geometries().remove(layers.get(0).geometries().get(0));
    }

    // Função para Limpar geometrias existentes e ativar ferramenta de desenho
    function drawPolygon() {
      clearGeometry();
      drawingTools.setShape('polygon');
      drawingTools.draw();
    }

    // Obtenha a geometria desenhada; vai definir a região de redução
    var aoi = drawingTools.layers().get(0).getEeObject();

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
          label: symbol.polygon + ' Desenhar à Geometria',
          onClick: drawPolygon,
        });

    // Adicionar botão de desenho no painel principal
    mainPanel.add(controlPanel);






//////////////////////////////////////////////////////////////////////////
// Configuração do evento: Passo 1. Desenhar à geometria /////////////////
//////////////////////////////////////////////////////////////////////////

// Adicione título do segundo passo da ferramenta no painel principal (esquerda)
    var tituloSecundario2 = '2. Defina os intervalos entre o incêndio:'
    var descricaoRotulo5 = ui.Label(tituloSecundario2, paragrafo_titulo);
    mainPanel.add(descricaoRotulo5);

// Adicione descrição no painel principal (esquerda)
    var descricao4_text = 
      'A ferramenta busca as imagens de satélite entre os intervalo definido.    ' +
      '   O formato deve ser: AAAA-MM-DD. Tenha atenção.';
    var descricaoRotulo6 = ui.Label(descricao4_text, estilo_subparagrafo);
    mainPanel.add(descricaoRotulo6);






///////////////////////////////////////////////////////////////////////////
// Configuração do evento: Passo 2. Inserir as datas para buscar imagens //
///////////////////////////////////////////////////////////////////////////

  // Adicione título dos dados de entrada PRÉFOGO
    var descricaoDataPrefogo_text = 
        'Insira as datas do intervalo Pré Fogo:';
    var descricaoPrefogoRotulo = ui.Label (descricaoDataPrefogo_text, estilo_paragrafo);
    mainPanel.add(descricaoPrefogoRotulo);

  // Crie campo para inserir a data do INICIO do intervalo PRÉFOGO 
    var TextBox_StartPrefire = ui.Textbox({
        value: '',
        placeholder: 'Data Início > Préfogo aqui...',
        onChange: function(TextBox_StartPrefire){
            start_prefire.setValue(TextBox_StartPrefire);
       }
    //    onChange: function(start_prefire){
    //        startPrefireDate.setValue(start_prefire);
    //   }
    });

  // Crie campo para inserir a data do FINAL do intervalo PRÉFOGO  
    var TextBox_EndPrefire = ui.Textbox({
        value: '',
        placeholder: 'Data Fim > Préfogo aqui...',
        onChange: function(end_prefire){
            endPrefireDate.setValue(end_prefire);
        }
    });

  // Adicione título dos dados de entrada PÓSFOGO
    var descricaoDataPosfogo_text = 
        'Insira as datas do intervalo Pós Fogo:';
    var descricaoPosfogoRotulo = ui.Label (descricaoDataPosfogo_text, estilo_paragrafo);

  // Crie campo para inserir a data do INICIO do intervalo PÓSFOGO
    var TextBox_StartPostfire = ui.Textbox({
        value: '',
        placeholder: 'Data Início > Pósfogo aqui...',
        onChange: function(start_postfire){
            startPostfireDate.setValue(start_postfire);
        }
    });

  // Crie campo para inserir a data do FINAL do intervalo PÓSFOGO
    var TextBox_EndPostfire = ui.Textbox({
        value: '',
        placeholder: 'Data Fim > Pósfogo aqui...',
        onChange: function(end_postfire){
            endPostfireDate.setValue(end_postfire);
        }
    });

  // Adicionar os campos no painel principal (esquerda)
    mainPanel.add (TextBox_StartPrefire);
    mainPanel.add (TextBox_EndPrefire);
    mainPanel.add (descricaoPosfogoRotulo);
    mainPanel.add (TextBox_StartPostfire);
    mainPanel.add (TextBox_EndPostfire);

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