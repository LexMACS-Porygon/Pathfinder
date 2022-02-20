function collect() {
    var a = document.getElementById("start");
    var start = a.options[a.selectedIndex].value;
    var b = document.getElementById("end");
    var end = b.options[b.selectedIndex].value;
    draw(start, end)
}

function distance(p1, p2) {
  return(Math.round(Math.sqrt((p1[0] - p2[0]) * (p1[0] - p2[0]) + (p1[1] - p2[1]) * (p1[1] - p2[1]))))
}

const arr = {
    0: [145, 305],
    1: [20, 255],
    2: [80, 255],
    3: [145, 255],
    4: [200, 255],
    5: [200, 150],
    6: [205, 45],
    7: [145, 45],
    8: [150, 150],
}
const graph = {
	0: { 3: distance(arr[0], arr[3]), },
	1: { 2: distance(arr[1], arr[2]), },
	2: { 1: distance(arr[1], arr[2]), 3: distance(arr[1], arr[3]), },
	3: { 2: distance(arr[2], arr[3]), 4: distance(arr[3], arr[4]), 0: distance(arr[0], arr[3]), 8: distance(arr[3], arr[8]), },
	4: { 3: distance(arr[3], arr[4]), 5: distance(arr[4], arr[5]), },
	5: { 4: distance(arr[4], arr[5]), 8: distance(arr[8], arr[5]), 6: distance(arr[6], arr[5]), },
    6: { 5: distance(arr[6], arr[5]), 7: distance(arr[7], arr[6]), },
    7: { 6: distance(arr[7], arr[6]), 8: distance(arr[7], arr[8]), },
    8: { 7: distance(arr[7], arr[8]), 5: distance(arr[5], arr[8]), 3: distance(arr[8], arr[3]), },
};

const nearestNode = (distances, visited) => {
	let shortest = null;

	for (let node in distances) {
		let currentIsShortest =
			shortest === null || distances[node] < distances[shortest];
		if (currentIsShortest && !visited.includes(node)) {
			shortest = node;
		}
	}
	return shortest;
};

const findShortestPath = (graph, startNode, endNode) => {
	let distances = {};
	distances[endNode] = Number.MAX_SAFE_INTEGER;
	distances = Object.assign(distances, graph[startNode]);

	let parents = { endNode: null };
	for (let child in graph[startNode]) {
		parents[child] = startNode;
	}

	let visited = [];
	let node = nearestNode(distances, visited);

	while (node) {
		let distance = distances[node];
		let children = graph[node];
		for (let child in children) {
			if (String(child) === String(startNode)) {
				continue;
			} else {
				let newdistance = distance + children[child];
				if (!distances[child] || distances[child] > newdistance) {
					distances[child] = newdistance;
					parents[child] = node;
				}
			}
		}
		visited.push(node);
		node = nearestNode(distances, visited);
	}

	let shortestPath = [endNode];
	let parent = parents[endNode];
	while (parent) {
		shortestPath.push(parent);
		parent = parents[parent];
	}
	shortestPath.reverse();

	let result = {
		distance: distances[endNode],
		path: shortestPath,
	};
    path = []
    for (i = 0; i < result["path"].length; i++) {
        path.push(arr[result["path"][i]])
    }
	return path;
};

let img;
function preload() {
  img = loadImage("mathbuilding.png");
}
function setup() {
    var myCanvas = createCanvas(300, 350);
    myCanvas.parent("canvas");
    noLoop();
}
function draw(start, end) {
    background(255);
    image(img, 10, 50, 83 * 4, 194 * 1.5);
    const path = findShortestPath(graph, parseInt(start), parseInt(end));
    for (var a = 0; a < 9; a++) {
        stroke('gold');
        strokeWeight(15);
        point(arr[a][0], arr[a][1]);
    }
    for (var p = 0; p < path.length - 1; p++) {
        stroke('navy')
        strokeWeight(5);
        line(path[p][0], path[p][1], path[p + 1][0], path[p + 1][1]);
    }
}
