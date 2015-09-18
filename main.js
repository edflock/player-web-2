$( function() {
    edflockGameWeb = new EdflockGameWeb("iframe");
    var point = 0;

    function updatePoints(pt) {
        point += pt;
        $('#points').html(point);
    }

    function awardBadge(data) {
        $("#badgeName").html(data.name);
        $("#badgeImage").attr('src', data.badgeUrl);
        $("#badgeName").data('id', data.id);
        $("#badgeModal").modal('show');
    }

    function updateLife(life) {
        var sel = $("#lifeIndicator i:gt("+(life-1)+")");
        sel.each(function(index, elem) {
            $(elem).removeClass('fa-heart').addClass('fa-heart-o');
        })
    }


    edflockGameWeb.provideUser((function() {
        var promise = $.get('http://api.edflock.com/user/id/'+userId);
        return promise;
    }) ());

    edflockGameWeb.subscribePointAdded(function(d,e) {
        updatePoints(e);
    });

    edflockGameWeb.subscribeLifeUpdate(function(d,e) {
        updateLife(e);
    });

    edflockGameWeb.subscribeStatusChange(function(d,e) {
        $('#status').html(e)
    });

    edflockGameWeb.subscribeBadgeAwarded(function(d,e) {
        awardBadge(e);
    });
    edflockGameWeb.subscribeStatusLost(function(d,e) {
        alert('lost with points: ' + e.points);
    });
    /*edflockGameWeb.initialize();*/
});
