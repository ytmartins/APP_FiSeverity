//--------------------------------------------------------------------------------//
//------------ API FiSeverity - mapping the severity of forest fires  ------------//
//--------------------------------------------------------------------------------//
// Documentation: @github                                                         //
// Author: Yuri Tomaz Martins (yuritomazmartins@hotmail.com)                      //
// Application: FiSeverity can be used to assess and map the severity             //
// of forest fires to support stakeholders in fire management and prevention.     //
//--------------------------------------------------------------------------------//

// Parte 1: Ajustar a User-Interface UI
// ui.root.clear();
var mapPanel = ui.Map();
// ui.root.widgets().reset([mapPanel]);

//----------------------------------------------------------------------------------
// Note: The basemap darkstyle code is based on the project by Tianjia Liu.
var baseMap = require("users/yurigaufrrj/packages:darkMap.js");
mapPanel.drawingTools().setShown(false);
mapPanel.setOptions("Dark", { Dark: baseMap.darkTheme });
mapPanel.setControlVisibility({ layerList: true, zoomControl: true });
//----------------------------------------------------------------------------------

// Parte 2: Predefinições de estilo ------------------------------------------------
// Crie a coleção de cores
var colors = { orange: "#F67529", transparent: "#11ffee00", grey: "#F8F9FA" };

// Predefina o estilo do título
var estilo_titulo = {
  margin: "14px 0px 0px 105px",
  fontWeight: "bold",
  fontSize: "30px",
  //border: '1px solid silver',
  width: "200px",
  padding: "1px",
  textAlign: "center",
  color: colors.orange,
  backgroundColor: colors.transparent,
};

// Predefina o estilo do título de parágrafo
var paragrafo_titulo = {
  fontSize: "18px",
  fontWeight: "bold",
  color: "black",
  padding: "1px",
  backgroundColor: colors.transparent,
};

// Predefina o estilo texto (de paragrafo)
var estilo_paragrafo = {
  fontSize: "15px",
  fontWeight: "bold",
  color: "grey",
  padding: "1px",
  backgroundColor: colors.transparent,
};

// Predefina o estilo de texto (de subparagrafo)
var estilo_subparagrafo = {
  fontSize: "14px",
  fontWeight: "50",
  color: "#212f3d", //"#515a5a", //'#616a6b', //'#9E9E9E',
  backgroundColor: colors.transparent,
};

// Crie a coleção de ícones
var symbol = {
  polygon: "🔶",
  engine: "✅",
  pan: "🤚",
  fire: "🔥",
  info: "👉",
  reset1: "♻️",
  reset2: "♻",
  reset3: "🔄",
};

// Predefinir o estilo das bordas
var estilo_borda = "1px solid silver";

// Parte 3: Configurar a User-Interface e interação entre paineis -------------------
// Crie e predefinir o painel (da esquerda)
var mainPanel = ui.Panel({
  layout: ui.Panel.Layout.flow("vertical", true),
  style: {
    stretch: "horizontal",
    height: "60%",
    width: "420px", //'410px' fica ajustado
    backgroundColor: colors.grey,
    border: estilo_borda,
    position: "top-left",
  },
});

// Use um PainelDividido para possibilitar o autoajuste dos dois paineis
var splitPanel = ui.SplitPanel({
  firstPanel: mainPanel,
  secondPanel: mapPanel,
  orientation: "horizontal",
  wipe: false,
  style: { stretch: "both" },
});

// Defina o painelDividido como único na root
ui.root.widgets().reset([splitPanel]);

// Centralize o 'mapPanel' na região (Portugal/Espanha)
mapPanel.setCenter(-2.5, 40.2, 6);

// Parte 4 - Criar o conteúdo do painel (da esquerda) ---------------------
// Adicione o titulo do aplicativo no painel (da esquerda)
var tituloPrincipal1 = ui.Label("FiSeverity", estilo_titulo);
mainPanel.add(tituloPrincipal1);

// Adicione descrição geral do objetivo no painel (da esquerda)
var descricao1_text =
  " FiSeverity assesses and maps the severity of forest fires." + "";
var descricaoRotulo1 = ui.Label(descricao1_text, estilo_paragrafo);
mainPanel.add(descricaoRotulo1);

// Adicione descrição geral do produto usado no painel (da esquerda)
var descricao3_text =
  " note: the satellite product used is Sentinel-2 MSI Level-2A, " +
  " it has new images every 5 days with a spatial resolution of 20 meters.";
var descricaoRotulo3 = ui.Label(descricao3_text, estilo_subparagrafo);
mainPanel.add(descricaoRotulo3);

// Adicione título do primeiro processo de input no painel (da esquerda)
var tituloSecundario1 = "Step 1: Define the area of interest";
var descricaoRotulo4 = ui.Label(tituloSecundario1, paragrafo_titulo);
mainPanel.add(descricaoRotulo4);

// Parte 5: Passo 1. Criar evento para Desenhar a Área de Interesse --------------------
// Predefina a drawingTools da User-Interface
// https://developers.google.com/earth-engine/tutorials/community/drawing-tools-region-reduction
var drawingTools = mapPanel.drawingTools();
drawingTools.setShown(false);

// Predefina o estilo da geometria criada
var dummyGeometry = ui.Map.GeometryLayer({
  geometries: null,
  name: "aoi_geometry",
  color: "#ff5c33",
});

// Adicione a geometria no 'layer manager' da User-Interface
drawingTools.layers().add(dummyGeometry);

// Desligue o modo desenho
drawingTools.setShape(null);

/*
  // Configurar a redução para evitar erro de memória/tempo limite
    var mapScale = Map.getScale();
    var scale = mapScale > 5000 ? mapScale * 2 : 5000;
*/

// Função para criar o desenho
var drawControl = ui.Button({
  label: symbol.polygon + " Draw",
  onClick: drawPolygon,
});

// Função para Apagar o desenho
var resetControl = ui.Button({
  label: symbol.reset3 + " Delete",
  onClick: function () {
    clearGeometry();
  },
});

// Função para parar de desenhar
function panMove() {
  drawingTools.stop();
}

// Botão para ativar 'panMove'
var panControl = ui.Button({
  label: symbol.pan + " Move",
  onClick: function () {
    panMove();
  },
});

// Crie o agrupamento para desenhar
var groupDraw = ui.Panel({
  widgets: [drawControl, resetControl, panControl],
  layout: ui.Panel.Layout.flow("horizontal"),
  style: {
    position: "top-left",
    height: "40px",
    padding: "0",
    margin: "0px 0 0 0",
    backgroundColor: colors.grey,
  },
});

// Adicione agrupamento no painel (da esquerda)
mainPanel.add(groupDraw);

// Adicione descrição dos botões usado no painel (da esquerda)
var descricaoButton_text =
  " Draw: Closes the double-clicked/join area to the starting point." +
  " Delete: Deletes the drawn area to create a new one on the map." +
  " Move: Disables the draw mode to move the map.";
var descricaoRotuloButton = ui.Label(descricaoButton_text, estilo_subparagrafo);
mainPanel.add(descricaoRotuloButton);

// Parte 6: Continuaçao. Criar o conteúdo do painel (da esquerda) -----------------------
// Adicione título do segundo processo de input no painel (da esquerda)
var tituloSecundario2 = "Step 2: Define the intervals";
var descricaoRotulo5 = ui.Label(tituloSecundario2, paragrafo_titulo);
mainPanel.add(descricaoRotulo5);

// Adicione descrição do intervalo no painel (da esquerda)
var descricaoIntervalo_text =
  " in this step define the pre-fire (before the fire) and " +
  " post-fire (after the fire) intervals to generate the severity analysis.";
var descricaoRotuloIntervalo = ui.Label(
  descricaoIntervalo_text,
  estilo_subparagrafo
);
mainPanel.add(descricaoRotuloIntervalo);

// Adicione subparagrafo com instruções no painel (da esquerda)
var descricao4_text =
  "note: if you don't find available images," +
  " increase the intervals. as a suggestion, use at least 15 days interval.";
var descricaoRotulo6 = ui.Label(descricao4_text, estilo_subparagrafo);
//mainPanel.add(descricaoRotulo6);

// Parte 7: Passo 2. Criar evento para Inserir as Datas de Interesse no painel (da esquerda)---------------------
// Criar o input do intervalo Préfogo
// Adicione título do input de intervalo Préfogo
var tituloPrefogo = ui.Label({
  value: " Pre-Fire Interval  ",
  style: {
    fontSize: "16px",
    fontWeight: "bold",
    padding: "6px 3px 0px 9px",
    margin: "0",
    backgroundColor: colors.grey,
  },
});

// Adicione barra de estilização
var centerDivider1 = ui.Label({
  value: " | ",
  style: {
    color: "d3d3d3",
    fontSize: "18px",
    padding: "5px 5px 0px 10px",
    margin: "0",
    backgroundColor: colors.grey,
  },
});

// Adicione a data Start-Prefire
var start_prefire = ui.Textbox({
  placeholder: "YYYY-MM-DD",
  style: {
    fontSize: "",
    width: "110px",
    padding: "4px 0px 0px 5px",
    margin: "0",
    backgroundColor: colors.grey,
  },
  onChange: function (value) {
    // pode personalizar
  },
});

// Adicione divisor de datas
var dateDivider1 = ui.Label({
  value: "To",
  style: {
    fontSize: "12px",
    padding: "9px 0px 0px 5px",
    margin: "0",
    backgroundColor: colors.grey,
  },
});

// Adicione a data End-Prefire
var end_prefire = ui.Textbox({
  placeholder: "YYYY-MM-DD",
  style: {
    fontSize: "",
    width: "110px",
    padding: "4px 0px 0px 5px",
    margin: "0",
    backgroundColor: colors.grey,
  },
  onChange: function (value) {
    // pode personalizar
  },
});

// Crie o agrupamento e estilização do Pre-Fire
var groupPrefire = ui.Panel({
  widgets: [
    tituloPrefogo,
    centerDivider1,
    start_prefire,
    dateDivider1,
    end_prefire,
  ],
  layout: ui.Panel.Layout.flow("horizontal"),
  style: {
    position: "top-left",
    height: "34px",
    padding: "0",
    margin: "10px 0px 0px 0px",
    backgroundColor: colors.grey,
  },
});

// Crie o input do intervalo Pósfogo
// Adicione título do input de intervalo Pósfogo
var tituloPosfogo = ui.Label({
  value: " Post-Fire Interval  ",
  style: {
    fontSize: "16px",
    fontWeight: "bold",
    padding: "6px 0px 0px 9px",
    margin: "0",
    backgroundColor: colors.grey,
  },
});

// Adicione a barra de estilização
var centerDivider2 = ui.Label({
  value: "  | ",
  style: {
    color: "d3d3d3",
    fontSize: "18px",
    padding: "4px 5px 0 5px",
    margin: "0",
    backgroundColor: colors.grey,
  },
});

// Adicione a data Start-Postfire
var start_postfire = ui.Textbox({
  placeholder: "YYYY-MM-DD",
  style: {
    fontSize: "",
    width: "110px",
    padding: "4px 0px 0px 5px",
    margin: "0",
    backgroundColor: colors.grey,
  },
  onChange: function (value) {
    // pode personalizar
  },
});

// Adicione divisor de datas
var dateDivider2 = ui.Label({
  value: "To",
  style: {
    fontSize: "12px",
    padding: "9px 0px 0px 5px",
    margin: "0",
    backgroundColor: colors.grey,
  },
});

// Adicione a data End-Postfire
var end_postfire = ui.Textbox({
  placeholder: "YYYY-MM-DD",
  style: {
    fontSize: "",
    width: "110px",
    padding: "4px 0px 0 5px",
    margin: "0",
    backgroundColor: colors.grey,
  },
  onChange: function (value) {
    // pode personalizar
  },
});

// Crie o agrupamento e estilização do Post-Fire
var groupPostfire = ui.Panel({
  widgets: [
    tituloPosfogo,
    centerDivider2,
    start_postfire,
    dateDivider2,
    end_postfire,
  ],
  layout: ui.Panel.Layout.flow("horizontal"),
  style: {
    position: "top-left",
    height: "34px",
    padding: "0",
    margin: "10px 0 0 0",
    backgroundColor: colors.grey,
  },
});

// Insira os grupos no painel (da esquerda)
mainPanel.add(groupPrefire);
mainPanel.add(groupPostfire);
mainPanel.add(descricaoRotulo6);

// Parte 8: Passo 3. Criar evento para executar a ferramenta no painel (da esquerda) ---------------------
// Adicione título do processo para executar a ferramenta (da esquerda)
var tituloSecundario3 = "Step 3: Run Severity Analysis";
var descricaoRotulo7 = ui.Label(tituloSecundario3, paragrafo_titulo);
mainPanel.add(descricaoRotulo7);

// Crie o botão 'Executar'
var submit = ui.Button({
  label: symbol.engine + " Run",
  onClick: process, // 'process' é o algoritmo de processamento do aplicativo
});

// Crie o botão 'Limpar API'
var resetAll = ui.Button({
  label: " Clear",
  onClick: function () {
    resetAPI();
    //mapPanel.clear()
  },
});

// Função para limpar e restaurar o mapa
function resetAPI() {
  mapPanel.clear();
  mapPanel.setOptions("Dark", { Dark: baseMap.darkTheme });
  mapPanel.setControlVisibility({ layerList: true, zoomControl: true });
  drawingTools.setShown(false);
  mapPanel.add(legend);
}

// Crie o agrupamento e estilização do 'Process'
var groupProcess = ui.Panel({
  widgets: [submit, resetAll],
  layout: ui.Panel.Layout.flow("horizontal"),
  style: {
    position: "top-left",
    height: "40px",
    padding: "0",
    margin: "0px 0 0 0",
    backgroundColor: colors.grey,
  },
});

// Insira o grupo no painel (da esquerda)
mainPanel.add(groupProcess);

// Adicione descrição do intervalo no painel (da esquerda)
var descricaoOutput_text =
  "note: make sure the area of interest is drawn when running." + "";
var descricaoRotuloOutput = ui.Label(descricaoOutput_text, estilo_subparagrafo);
mainPanel.add(descricaoRotuloOutput);

// Adicione hiperlink com o acesso a mais informações no painel (da esquerda)
var descricaolink_text = symbol.info + " Exemplos de incêndios em Portugal";
var infourl =
  "https://www.notion.so/Estudos-de-Caso-Portugal-94740db606d74beeb1214a2891bf1158";
var descricaoRotulolink = ui.Label(
  descricaolink_text,
  estilo_paragrafo,
  infourl
);
//mainPanel.add(descricaoRotulolink);

// Parte 9: Criar as funções do aplicativo ------------------------------
// Função para limpar 'drawingTools'
function clearGeometry() {
  var layers = drawingTools.layers();
  layers.get(0).geometries().remove(layers.get(0).geometries().get(0));
}

// Função para limpar geometria e ativar ferramenta 'draw'
function drawPolygon() {
  clearGeometry();
  drawingTools.setShape("polygon");
  drawingTools.draw();
}

// Função para consultar imagens Sentinel-2 (atualizada para S2_SR_HARMONIZED e máscara via SCL)
function consult_sen(start, end, aoi, cloud) {
  //input/entradas:
  //start = data início
  //end = data fim
  //aoi = área de interesse
  //cloud = máximo de nuvem na imagem

  // Coleção Sentinel-2 Level-2A Harmonizada (com correção atmosférica)
  var ImCol = "COPERNICUS/S2_SR_HARMONIZED";
  var imagery = ee.ImageCollection(ImCol);

  // Função para máscara de nuvem pela banda SCL (substitui a antiga QA60)
  function maskS2sr(image) {
    var scl = image.select("SCL");

    // Remove pixels de:
    // 1 = Saturado/Defeituoso, 3 = Sombra de nuvem,
    // 8 = Nuvem (prob. média), 9 = Nuvem (prob. alta), 10 = Cirrus fino
    // Nota: Se cicatrizes muito escuras forem mascaradas como sombra, remova ".and(scl.neq(3))"
    var mask = scl
      .neq(1)
      .and(scl.neq(3))
      .and(scl.neq(8))
      .and(scl.neq(9))
      .and(scl.neq(10));

    return image
      .updateMask(mask)
      .copyProperties(image, ["system:time_start"]);
  }

  // Filtre por data, área e percentual de nuvens, aplicando a máscara uma única vez
  var SentinelFiltro = imagery
    .filterDate(start, end)
    .filterBounds(aoi)
    .filter(ee.Filter.lt("CLOUDY_PIXEL_PERCENTAGE", cloud))
    .map(maskS2sr);

  // Gerar o mosaico com imagens Sentinel-2A entre as datas e recortar para a AOI
  var SentinelClip = SentinelFiltro.mosaic().clip(aoi);

  return SentinelClip;
}

// Parte 10: Criar os processos do aplicativo ------------------------------
// Crie a função com o processo principal do aplicativo
function process() {
  // Selecione as entradas com as configurações do usuário na User-Interface
  var aoi = drawingTools.layers().get(0).getEeObject();
  var start_preF = start_prefire.getValue();
  var end_preF = end_prefire.getValue();
  var start_postF = start_postfire.getValue();
  var end_postF = end_postfire.getValue();

  // Consulte as imagens Sentinel-2A
  var SentinelClip_pre = consult_sen(start_preF, end_preF, aoi, 20);
  var SentinelClip_post = consult_sen(start_postF, end_postF, aoi, 20);

  // Calcule o NBR = (NIR-SWIR2) / (NIR+SWIR2)
  var pre_nbr = SentinelClip_pre.normalizedDifference(["B8", "B12"]);
  var post_nbr = SentinelClip_post.normalizedDifference(["B8", "B12"]);

  // Calcule dNBR (índice de severidade)
  var dNBR_unscaled = pre_nbr.subtract(post_nbr);
  var dNBR = dNBR_unscaled.multiply(1000);

  // Gere as saídas no 'layer manager' na User-Interface
  mapPanel.addLayer(
    aoi,
    {
      color: "#ff5c33",
      strokeWidth: 5,
      transparent: 70,
    },
    "Área de Interesse",
    true
  );

  mapPanel.addLayer(
    SentinelClip_pre,
    {
      max: 2000,
      min: 0.0,
      gamma: 1.5,
      bands: ["B4", "B3", "B2"],
    },
    "Imagem Sentinel 2 RGB PréFogo",
    false
  );

  mapPanel.addLayer(
    SentinelClip_post,
    {
      max: 2000,
      min: 0.0,
      gamma: 1.5,
      bands: ["B4", "B3", "B2"],
    },
    "Imagem Sentinel 2 RGB PósFogo",
    false
  );

  mapPanel.addLayer(
    pre_nbr,
    {
      max: 2,
      min: 0,
      gamma: 1.0,
      bands: ["nd"],
    },
    "NBR PréFogo",
    false
  );

  mapPanel.addLayer(
    post_nbr,
    {
      max: 2,
      min: 0,
      gamma: 1.0,
      bands: ["nd"],
    },
    "NBR PósFogo",
    false
  );

  mapPanel.addLayer(
    dNBR,
    {
      max: 1000,
      min: -1000,
      palette: ["white", "black"],
    },
    "dNBR escala-cinza",
    false
  );

  // Crie as classes de severidade para o dNBR (classificado)
  var sld_intervals =
    "<RasterSymbolizer>" +
    '<ColorMap type="intervals" extended="false" >' +
    '<ColorMapEntry color="#d7dbdd" quantity="-500" label="Sem Dados"/>' +
    '<ColorMapEntry color="#7a8737" quantity="-250" label="Alta Regeneração" />' +
    '<ColorMapEntry color="#acbe4d" quantity="-100" label="Baixa Regeneração" />' +
    '<ColorMapEntry color="#0ae042" quantity="100" label="Não Queimada" />' +
    '<ColorMapEntry color="#fff70b" quantity="270" label="Baixa Severidade" />' +
    '<ColorMapEntry color="#ffaf38" quantity="440" label="Moderada-Baixa Severidade" />' +
    '<ColorMapEntry color="#ff641b" quantity="660" label="Moderada-Alta Severidade" />' +
    '<ColorMapEntry color="#a41fd6" quantity="2000" label="Alta Severidade" />' +
    "</ColorMap>" +
    "</RasterSymbolizer>";

  // Adicionar o dNBR classificado no 'layer manager'
  mapPanel.addLayer(dNBR.sldStyle(sld_intervals), {}, "dNBR classificado");

  // Limpe a edição de geometria (para dar destaque as saídas no 'layer manager')
  clearGeometry();
  // Desative o modo desenho
  drawingTools.stop();

  // Exporte o dNBR (tipo .TIFF)
  Export.image.toDrive({
    image: dNBR,
    description: "Export_dNBR",
    scale: 20,
    fileNamePrefix: "Export_dNBR",
    region: aoi,
    maxPixels: 1e10,
  });

  // Exporte a Área de Interesse (tipo .KML)
  var feature = ee.FeatureCollection([ee.Feature(aoi)]);
  Export.table.toDrive({
    collection: feature,
    description: "Export_AOI",
    fileFormat: "KML",
  });

  // Configure a User-Interface após ativar o 'Executar'
  mapPanel.centerObject(aoi);
  //mapPanel.setOptions('HYBRID');

  // Resultado separado em 8 classes de severidade
  var thresholds = ee.Image([-1000, -251, -101, 99, 269, 439, 659, 2000]);
  var classified = dNBR.lt(thresholds).reduce("sum").toInt();

  // Adicione as estatisticas de area queimada
  // Conte o número de pixels em toda a camada
  var allpix = classified.updateMask(classified); // mascara toda a camada
  var pixstats = allpix.reduceRegion({
    reducer: ee.Reducer.count(), // conte pixels para cada classe
    geometry: aoi,
    scale: 30,
  });
  var allpixels = ee.Number(pixstats.get("sum")); // extraia a contagem de pixels como um número

  // Crie uma lista vazia para armazenar valores de área
  var arealist = [];

  // Crie uma função para derivar a extensão de uma classe de severidade
  // Os argumentos são o número da classe e o nome da classe
  var areacount = function (cnr, name) {
    var singleMask = classified.updateMask(classified.eq(cnr)); // mascara para cada classe
    var stats = singleMask.reduceRegion({
      reducer: ee.Reducer.count(), // conte os pixels para cada classe
      geometry: aoi,
      scale: 30,
    });
    var pix = ee.Number(stats.get("sum"));
    var hect = pix.multiply(900).divide(10000); // 30m x 30m --> 900 sqm
    var perc = pix.divide(allpixels).multiply(10000).round().divide(100); // obter a porcentagem de área por classe e arredondar para 2 casas decimais
    arealist.push({
      Class: name,
      Pixels: pix,
      Hectares: hect,
      Percentage: perc,
    });
  };

  // Classes de severidade em diferentes ordens
  var labelsChartOrig = [
    "Sem Dados",
    "Alta Severidade",
    "Moderada-Alta Severidade",
    "Moderada-Baixa Severidade",
    "Baixa Severidade",
    "Não Queimada",
    "Baixa Regeneração",
    "Alta Regeneração",
  ];

  // Execute a função para cada classe
  for (var i = 0; i < 8; i++) {
    areacount(i, labelsChartOrig[i]);
  }
  //print("Área Ardida por Classe de Severidade", arealist);

  // Calcule da área de interesse em Hectares
  var areaAOI = ee.Image(1).clip(aoi).reduceRegion(ee.Reducer.sum(), aoi, 10);
  //print("Area de Interesse em Hectares", ee.Number(areaAOI.get("constant")).multiply(100).divide(10000));

  // Crie o painel do Chart
  var chartPanel = ui.Panel({
    style: {
      height: "200px",
      width: "225px",
      position: "bottom-right",
      shown: true,
    },
  });
  mapPanel.add(chartPanel);

  // Crie o PieChart
  var labelsChart = [
    "0-No Data",
    "1-High Severity",
    "2-Moderate-High Severity",
    "3-Moderate-Low Severity",
    "4-Low Severity",
    "5-Not Burned",
    "6-Low Regeneration",
    "7-High Regeneration",
  ];

  // Crie o estrutura do Chart
  var count = allpix.eq([0, 1, 2, 3, 4, 5, 6, 7]).rename(labelsChart);

  // Calcule com o .pixelArea() -> é o método mais adequado
  var total = count.multiply(ee.Image.pixelArea()).round().divide(10000);
  var area = total.reduceRegion({
    reducer: ee.Reducer.sum(),
    geometry: aoi,
    scale: 30,
    maxPixels: 1e11,
    bestEffort: true,
  });

  // Imprime o dicionário com a área (em hectares) por classe
  print("Área por classe (ha):", area);

  // Crie o PieChart
  var chart = ui.Chart.image
    .regions({
      image: total,
      regions: aoi,
      reducer: ee.Reducer.sum(),
      scale: 30,
    })
    .setChartType("PieChart")
    .setOptions({
      width: 230,
      height: 170,
      title: "Area by Class (%)",
      is3D: false,
      colors: [
        "d7dbdd", // (0) Sem Dados
        "a41fd6", // (7) Alta Severidade
        "ff641b", // (6) Moderada-Alta Severidade
        "ffaf38", // (5) Moderada-Baixa Severidade
        "fff70b", // (4) Baixa Severidade
        "0ae042", // (3) Não Queimada
        "acbe4d", // (2) Baixa Regeneração
        "7a8737", // (1) Alta Regeneração
      ],
    });

  // Substitua o gráfico existente no painel do gráfico pelo novo gráfico.
  chartPanel.widgets().reset([chart]);
}

// Parte 12: Criar a Legenda com as classes dNBR (USGS) -------------------------
//------------------------------------------------ Creditos: UN-SPIDER(ONU) - Inicio
// Configure a posição do painel (da legenda)
var legend = ui.Panel({
  style: {
    position: "bottom-right",
    padding: "8px 15px",
  },
});

// Crie o título no painel (da legenda)
var legendTitle = ui.Label({
  value: "Fire Severity Classes",
  //dNBR Classes
  style: {
    fontWeight: "bold",
    fontSize: "18px",
    margin: "0 0 4px 0",
    padding: "0",
  },
});

// Adicione o título ao painel (da legenda)
legend.add(legendTitle);

// Crie e aplicar estilo na linha (Cor + Nome Classe)
var makeRow = function (color, name) {
  // Crie o rótulo-caixa para receber as cores das classes dNBR
  var colorBox = ui.Label({
    style: {
      backgroundColor: "#" + color,
      // Use 'padding' para definir a largura e altura da caixa
      padding: "8px",
      border: "1px solid black",
      margin: "0 0 4px 0",
    },
  });

  // Crie o rótulo com a descrição da classe
  var description = ui.Label({
    value: name,
    style: { margin: "0 0 4px 6px" },
  });

  // Gere o painel Legenda com (caixa de cor + nome da classe)
  return ui.Panel({
    widgets: [colorBox, description],
    layout: ui.Panel.Layout.flow("horizontal"),
  });
};

// Predefina a paleta com Cores de cada Classes de Severidade (modelo USGS)
var palette = [
  "d7dbdd", // (0) Sem Dados
  "a41fd6", // (7) Alta Severidade
  "ff641b", // (6) Moderada-Alta Severidade
  "ffaf38", // (5) Moderada-Baixa Severidade
  "fff70b", // (4) Baixa Severidade
  "0ae042", // (3) Não Queimada
  "acbe4d", // (2) Baixa Regeneração
  "7a8737", // (1) Alta Regeneração
];

// Predefina os Nomes de cada Classe de Severidade (modelo USGS)
var names = [
  "No Data",
  "High Severity",
  "Moderate-High Severity",
  "Moderate-Low Severity",
  "Low Severity",
  "Unburned",
  "Low Regeneration",
  "High Regeneration",
];

// Adicione as Cores e os Nomes de cada Classes de Severidade (modelo USGS)
for (var i = 0; i < 8; i++) {
  legend.add(makeRow(palette[i], names[i]));
}

// Adicione Legenda ao mapa
mapPanel.add(legend);
//------------------------------------------------ Creditos: UN-SPIDER(ONU) - Fim