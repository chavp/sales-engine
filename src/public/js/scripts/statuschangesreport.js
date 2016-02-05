function plotGraph(id,type, mainpoint, firstPoint, firstNum, secondPoint, secondNum) {
    var height = 150;
    var width = 500;
    var g = new Graph();


    st1 = {
        directed: true, label: firstNum,
        "label-style": {
            "font-size": 20,
            "z-index": 1000,
            "fill": "#000",
            "stroke": "#888"
        }
    };
    st2 = {
        directed: true, label: secondNum,
        "label-style": {
            "font-size": 20,
            "z-index": 1000,
            "fill": "#000",
            "stroke": "#888"
        }
    };
    /* customize the colors of that edge */

    if (secondPoint == "Null") {
        g.addNode(firstPoint, {
            label: firstPoint,
            'fill': "#fff"
        });

        g.addNode(mainpoint, {
            label: mainpoint,
            'fill': "#369"
        });

        g.addEdge(firstPoint, mainpoint, st1);
    }
    else {
        g.addNode(firstPoint, {
            label: firstPoint,
            'fill': "#fff"
        });

        g.addNode(mainpoint, {
            label: mainpoint,
            'fill': "#369"
        });

        g.addNode(secondPoint, {
            label: secondPoint,
            'fill': "#fff"
        });
       g.addEdge(firstPoint, mainpoint, st1);
       g.addEdge(secondPoint, mainpoint, st2);
    }
    

    /* layout the graph using the Spring layout implementation */
    var layouter = new Graph.Layout.Spring(g);
    layouter.layout();

    /* draw the graph using the RaphaelJS draw implementation */
    var renderer = new Graph.Renderer.Raphael(type+'Canvas' + id, g, width, height);
    renderer.draw();
}


function toggleLeadsGraphRow(id, mainpoint, firstPoint, firstNum, secondPoint, secondNum) {
    if ($('#leadsGraphRow' + id).hasClass('hide')) {
        $('#leadsGraphRow' + id).removeClass('hide');
        $('#leadsIcon' + id).removeClass('glyphicon-play').addClass('glyphicon-triangle-bottom');
        plotGraph(id,'Leads', mainpoint, firstPoint, firstNum, secondPoint, secondNum);
    }
    else {
        $('#leadsGraphRow' + id).addClass('hide');
        $('#leadsIcon' + id).removeClass('glyphicon-triangle-bottom').addClass('glyphicon-play');
        $('#LeadsCanvas' + id).empty();
    }
}

function toggleopportunitiesGraphRow(id, mainpoint, firstPoint, firstNum, secondPoint, secondNum) {
    if ($('#opportunitiesGraphRow' + id).hasClass('hide')) {
        $('#opportunitiesGraphRow' + id).removeClass('hide');
        $('#opportnitiesIcon' + id).removeClass('glyphicon-play').addClass('glyphicon-triangle-bottom');
        plotGraph(id, 'opportunities', mainpoint, firstPoint, firstNum, secondPoint, secondNum);
    }
    else {
        $('#opportunitiesGraphRow' + id).addClass('hide');
        $('#opportnitiesIcon' + id).removeClass('glyphicon-triangle-bottom').addClass('glyphicon-play');
        $('#opportunitiesCanvas' + id).empty();
    }
}