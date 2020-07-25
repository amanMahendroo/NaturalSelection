$(document).ready(function () {
	
})

function newUpdate(msg, type) {
	let $p = $("<div>" + msg + "</div>")
	$p.addClass('update')
	$p.addClass(type)
	$('.notes').prepend($p)
	// $('.notes').scrollTop = $('.notes').scrollHeight
}