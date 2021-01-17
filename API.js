// API FiSeverity - mapping the severity of forest fires
// credit: Yuri Tomaz Martins

// Parte 1: Ajustar a User-Interface UI
  ui.root.clear();
  var mapPanel = ui.Map();
  ui.root.widgets().reset([mapPanel]);

// Parte 2: Predefinições de estilo ------------------------------------------------
  // Criar a coleção de cores
    var colors = {'orange': '#ff751a','transparent':'#11ffee00', 'grey':'#F8F9FA'};

  // Predefinir o estilo do título
    var estilo_titulo = {
        fontWeight: 'bold',
        fontSize: '30px',
        padding: '1px',
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
    };

  // Predefinir o estilo das bordas
    var estilo_borda = '1px solid rgba(205, 205, 205, 10.5)';

// Parte 3: Configurar a User-Interface e interação entre paineis -------------------
  // Criar e predefinir o painel (da esquerda)
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

  // Usar um PainelDividido para possibilitar o autoajuste dos dois paineis
    var splitPanel = ui.SplitPanel({
        firstPanel: mainPanel,
        secondPanel: mapPanel,
        orientation: 'horizontal',
        wipe: false,
        style: {stretch: 'both'}
    });

  // Definir o painelDividido como único na root
    ui.root.widgets().reset([splitPanel]);

  // Centralizar o 'mapPanel' na região (Portugal/Espanha)
    mapPanel.setCenter (-2.50,40.20,6);

// Parte 4 - Criar o conteúdo do painel (da esquerda) ---------------------
  // Adicionar o titulo do aplicativo no painel (da esquerda)
    var tituloPrincipal1 = ui.Label('Aplicativo > FiSeverity', estilo_titulo);
      mainPanel.add(tituloPrincipal1);

  // Adicionar descrição geral do objetivo no painel (da esquerda)
    var descricao1_text =
        'O aplicativo compara imagens de satélite de antes e depois do incêndio ' +
        ' e gera uma análise da severidade da área ardida.' +
        ' Os resultados podem apoiar relatórios de danos' + 
        ' e subsidiar banco de dados dos incêndios.';
      var descricaoRotulo1 = ui.Label(descricao1_text, estilo_paragrafo);
      mainPanel.add(descricaoRotulo1);

  // Adicionar descrição geral do produto usado no painel (da esquerda)
    var descricao3_text = 
        'A imagem de satélite utilizada é Sentinel-2 MSI Level-2A (com correção atmosférica).' +
        ' Nova imagem a cada: 5 dias, resolução espacial: 10 metros.';
      var descricaoRotulo3 = ui.Label (descricao3_text, estilo_paragrafo);
      mainPanel.add(descricaoRotulo3);

  // Adicionar hiperlink com o acesso a mais informações no painel (da esquerda)
    var descricaolink_text = 
        '+ Info';
      var infourl = 'https://github.com/yuritmartins/burnseverity';
      var descricaoRotulolink = ui.Label (descricaolink_text, estilo_paragrafo, infourl);
      mainPanel.add(descricaoRotulolink);

  // Adicionar título do primeiro processo de input no painel (da esquerda)
    var tituloSecundario1 = 'Passo 1: Crie a área de interesse'
      var descricaoRotulo4 = ui.Label(tituloSecundario1, paragrafo_titulo);
      mainPanel.add(descricaoRotulo4);

// Parte 5: Passo 1. Criar evento para Desenhar a Área de Interesse -------------------- 
  // Predefinir a drawingTools da User-Interface
    var drawingTools = mapPanel.drawingTools();
    drawingTools.setShown(false);

  // Predefinir o estilo da geometria criada
    var dummyGeometry = ui.Map.GeometryLayer({geometries: null, name: 'aoi_geometry', color: '#ff5c33'});

  // Adicionar a geometria no 'layer manager' da User-Interface
    drawingTools.layers().add(dummyGeometry);

  // Desligar o modo desenho
    drawingTools.setShape(null);

  // Configurar a redução para evitar erro de memória/tempo limite
    var mapScale = Map.getScale();
    var scale = mapScale > 5000 ? mapScale * 2 : 5000;

  // Criar o botão e o evento para desenhar geometria  
    var controlPanel = ui.Button({
          label: symbol.polygon +' Desenhar Área de Interesse',
          onClick: drawPolygon,
    });

  // Adicionar botão de desenho no painel (da esquerda)
    mainPanel.add(controlPanel);

// Parte 6: Continuaçao. Criar o conteúdo do painel (da esquerda) -----------------------
  // Adicionar título do segundo processo de input no painel (da esquerda)
    var tituloSecundario2 = 'Passo 2: Defina as datas entre o incêndio'
      var descricaoRotulo5 = ui.Label(tituloSecundario2, paragrafo_titulo);
      mainPanel.add(descricaoRotulo5);

  // Adicionar subparagrafo com instruções no painel (da esquerda)
    var descricao4_text = 
        'As imagens de satélite são buscadas pelo intervalo definido.' +
        ' Caso não encontre imagens disponíveis, aumente o intervalo.';
      var descricaoRotulo6 = ui.Label(descricao4_text, estilo_subparagrafo);
      mainPanel.add(descricaoRotulo6);

// Parte 7: Passo 2. Criar evento para Inserir as Datas de Interesse ---------------------
  // Adicionar o título com a descrição do intervalo
    var descricaoStartDataPrefogo_text = 
        'Intervalo Préfogo (Início):';
      var descricaoStartPrefogoRotulo = ui.Label (descricaoStartDataPrefogo_text, estilo_paragrafo);

    // Criar o campo para INSERIR a data de INICIO do intervalo PREFOGO
      var start_prefire = ui.Textbox({
          value: '',
          placeholder: 'YYYY-MM-DD',
          style: {width: '95px'}
      });

  // Adicionar o título com a descrição do intervalo
    var descricaoEndDataPrefogo_text = 
        'Intervalo Préfogo (Fim):';
      var descricaoEndPrefogoRotulo = ui.Label (descricaoEndDataPrefogo_text, estilo_paragrafo);

    // Criar o campo para INSERIR a data do FINAL do intervalo PREFOGO
      var end_prefire = ui.Textbox({
          value: '',
          placeholder: 'YYYY-MM-DD',
          style: {width: '95px'}
      });

  // Adicionar o título com a descrição do intervalo
    var descricaoStartDataPosfogo_text = 
        'Intervalo Pósfogo (Início):';
      var descricaoStartPosfogoRotulo = ui.Label (descricaoStartDataPosfogo_text, estilo_paragrafo);

    // Criar o campo para INSERIR a data de INICIO do intervalo POSFOGO
      var start_postfire = ui.Textbox({
          value: '',
          placeholder: 'YYYY-MM-DD',
          style: {width: '95px'}
      });

  // Adicionar o título com a descrição do intervalo
    var descricaoEndDataPosfogo_text = 
        'Intervalo Pósfogo (Fim):';
      var descricaoEndPosfogoRotulo = ui.Label (descricaoEndDataPosfogo_text, estilo_paragrafo);

    // Criar o campo para INSERIR a data do FINAL do intervalo POSFOGO
      var end_postfire = ui.Textbox({
          value: '',
          placeholder: 'YYYY-MM-DD',
          style: {width: '95px'}
      });

  // Adicionar os campos no painel (da esquerda)
      mainPanel.add (descricaoStartPrefogoRotulo);
      mainPanel.add (start_prefire);
      mainPanel.add (descricaoEndPrefogoRotulo)
      mainPanel.add (end_prefire);
      mainPanel.add (descricaoStartPosfogoRotulo);
      mainPanel.add (start_postfire);
      mainPanel.add (descricaoEndPosfogoRotulo);
      mainPanel.add (end_postfire);


// Parte 8: Criar o conteúdo do painel (do mapa) -----------------------
  // Criar o botão 'Executar'
    var submit = ui.Button({
      label: symbol.engine + ' Executar dNBR',
      onClick: process // 'process' é o algoritmo de processamento do aplicativo
    });
  // Adicionar o 'Executar' no painel (do mapa)
    mapPanel.add(submit);

// Parte 9: Criar as funções do aplicativo ------------------------------
  // Função para limpar 'drawingTools'
    function clearGeometry(){
      var layers = drawingTools.layers();
      layers.get(0).geometries().remove(layers.get(0).geometries().get(0));
    }

  // Função para limpar geometria e ativar ferramenta 'draw' 
    function drawPolygon(){
      clearGeometry();
      drawingTools.setShape('polygon');
      drawingTools.draw();
    }

  // Função para consultar imagens Sentinel-2
  function consult_sen(start,end,aoi,cloud) {
    //input/entradas:
    //start = data início
    //end = data fim
    //aoi = área de interesse
    //cloud = máximo de nuvem na imagem

    // Criar a 'ImageCollection' da coleção Sentinel-2 Level2A (com correção atmosférica)
      var ImCol = 'COPERNICUS/S2_SR'
      var imagery = ee.ImageCollection(ImCol);
        var IMGSentinel = ee.ImageCollection (imagery
          .filterDate (start, end)
          .filterBounds (aoi)
          .map(maskS2sr))
          .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', cloud));
        //.median());
 
    // Creditos de criação: UN-SPIDER(ONU) - Inicio
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
    // Creditos de criação: UN-SPIDER(ONU) - Final
 
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
      mapPanel.addLayer(aoi,{
        color: '#ff5c33',
        strokeWidth: 5,
        transparent: 70}, 
        'Área de Interesse');

      mapPanel.addLayer(SentinelClip_pre, {
        max: 2000,
        min: 0.0,
        gama: 1.5,
        bands: ['B4', 'B3', 'B2']},
        'Imagem Sentinel 2 RGB PréFogo');

      mapPanel.addLayer(SentinelClip_post, {
        max: 2000,
        min: 0.0,
        gamma: 1.5,
        bands: ['B4', 'B3', 'B2']},
        'Imagem Sentinel 2 RGB PósFogo');

      mapPanel.addLayer(pre_nbr, {
        max: 2,
        min: 0,
        gamma: 1.0,
        bands: ['nd']},
        'nbr PréFogo');

      mapPanel.addLayer(post_nbr,{
        max: 2,
        min: 0,
        gamma: 1.0,
        bands: ['nd']},
        'nbr PósFogo');

      mapPanel.addLayer(dNBR,{
        max: 1000,
        min: -1000,
        palette: ['white', 'black']},
        'dNBR escala-cinza');

      // Definir o estilo SLD de intervalos discretos para aplicar e classificar o dNBR
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
      
        mapPanel.addLayer(dNBR.sldStyle(sld_intervals), {}, 'dNBR classificado');

    // Limpar a edição de geometria (para dar destaque as saídas no 'layer manager')
      clearGeometry();

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
      mapPanel.setOptions('HYBRID');
  }

// Parte 11: Criar a Legenda com as classes dNBR (USGS) -------------------------
  // Creditos de criação: UN-SPIDER(ONU) - Inicio
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
    var makeRow = function(color, name) {
  
      // Criar o rótulo-caixa para receber as cores das classes dNBR
        var colorBox = ui.Label({
          style: {
            backgroundColor: '#' + color,
            // Usar 'padding' para definir a largura e altura da caixa
            padding: '8px',
            margin: '0 0 4px 0'
          }
        });
  
      // Criar o rótulo com a descrição da classe
        var description = ui.Label({
          value: name,
          style: {margin: '0 0 4px 6px'}
        });
  
      // Gerar o painel Legenda com (caixa de cor + nome da classe)
        return ui.Panel({
          widgets: [colorBox, description],
          layout: ui.Panel.Layout.Flow('horizontal')
        });
    };
  
  // Predefinir a paleta com Cores de cada Classes de Severidade (modelo USGS)
    var palette =['7a8737', 'acbe4d', '0ae042', 'fff70b', 'ffaf38', 'ff641b', 'a41fd6'];
  
  // Predefinir os Nomes de cada Classe de Severidade (modelo USGS)
    var names = ['Alta Regeneração','Baixa Regeneração','Não Queimada', 'Baixa Severidade',
    'Moderada-Baixa Severidade', 'Moderada-Alta Severidade', 'Alta Severidade'];
  
  // Adicionar as Cores e os Nomes de cada Classes de Severidade (modelo USGS)
    for (var i = 0; i < 7; i++) {
      legend.add(makeRow(palette[i], names[i]));
    }  
  
  // Adicionar Legenda ao mapa
    mapPanel.add(legend);
  // Creditos de criação: UN-SPIDER(ONU) - Fim

/*
EXPERIMENTAÇÃO
*/

/*
// Implementar data lado a lado
var app = {};

app.createConstants = function() {
  app.HELPER_TEXT_STYLE = {
  margin: '8px 0 -8px 8px',
  //fontSize: '12px',
  color: 'gray',
  stretch: 'horizontal'
  };
};

app.filters.panel = ui.Panel({
  widgets: [ // entra as datas como estão escritas inicialmente
//ex
startDate: ui.Textbox({
  placeholder: 'YYYY-MM-DD',
  value: '2017-12-27',
  // onChange: app.refreshMapLayer,
  style: {width: '90px'}
}),

app.filters.panel = ui.mainPanel({
  widgets: [

mainPanel([
  ui.Label('Reference Dates:', app.HELPER_TEXT_STYLE),
  app.filters.start_prefire,
  ui.Label('to'),
  app.filters.start_postfire
])
  ]
};

*/

/*
EXPERIMENTAÇÃO
*/