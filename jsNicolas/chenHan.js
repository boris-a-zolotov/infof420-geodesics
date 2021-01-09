class ChenHanNode {
  constructor(img, proj=null, edge=null) {
    this.img = img;
    this.proj = proj;
    this.edge = edge;
    this.children = [];
    if (proj && !edge) {
      this.edge = proj;
      this.proj = {
        start: proj.start.p5V,
        end: proj.end.p5V,
        empty: function () { return false; }
      };
    }
  }

  addChild(child) { this.children.push(child); }
  unfold() { return this.edge.unfold(this.img); }
}


function chenHanNaive(source, srcFace, targetFace, facesNum) {
  const tree = new ChenHanNode(source);
  let leaves = [];
  srcFace.edges.forEach((edge) => {
    const l = new ChenHanNode(source, edge);
    tree.addChild(l);
    leaves.push(l);
  });
  for (let i=0; i < facesNum; ++i) {
    const newLeaves = [];
    leaves.forEach((leaf) => {
      const shadow = leaf.edge.shadow;
      if (!targetFace || !Object.is(shadow, targetFace)) {
        const img = leaf.unfold();
        shadow.edges.forEach((edge) => {
          if (!Object.is(edge.start, leaf.edge.end) || !Object.is(edge.end, leaf.edge.start)) {
            const proj = new Projection(img, leaf.proj, edge);
            if (!proj.empty()) {
              const l = new ChenHanNode(img, proj, edge);
              leaf.addChild(l);
              newLeaves.push(l);  
            }
          }
        })
      }
    })
    leaves = newLeaves;
  }
  return tree;
}

function chenHanNaive_(source, sourceFace, targetFace, facesNum) {
  const root = {
    edge: null,
    image: source,
    projection: null,
    children: []
  };
  let leaves = [];
  sourceFace.edges.forEach((edge) => {
    const node = {
      edge: edge,
      image: source,
      projection: {
        start: edge.start.p5V,
        end: edge.end.p5V,
        empty: function () {
          return false;
        }
      },
      children: []
    };
    root.children.push(node);
    leaves.push(node);
  });
  for (let i = 0; leaves.length && i < facesNum; ++i) {
    const currentLeaves = leaves;
    leaves = [];
    currentLeaves.forEach((leaf) => {
      const shadow = leaf.edge.shadow;
      if (!Object.is(shadow, targetFace)) {
        const img = leaf.edge.unfold(leaf.image);
        shadow.edges.forEach((edge) => {
          if (leaf.edge.start !== edge.end && leaf.edge.end !== edge.start) {
            const proj = new Projection(img, leaf.projection, edge);
            if (!proj.empty()) {
              const node = {
                edge: edge,
                image: img,
                projection: proj,
                children: []
              };
              leaf.children.push(node);
              leaves.push(node);
            }
          }
        });
      }
    });
  }
  return root;
}

function buildPaths(
  sourcePoint,
  sourceFace,
  targetPoint,
  targetFace,
  facesNum
) {
  const tree = chenHanNaive(sourcePoint, sourceFace, targetFace, facesNum);
  const deadEnds = [];
  const paths = [];
  let partialPaths = [];
  tree.children.forEach((child) =>
    partialPaths.push({
      path: [[child.img, child.edge.start, child.edge.end]],
      node: child
    })
  );
  while (partialPaths.length) {
    const current = partialPaths;
    partialPaths = [];
    current.forEach((partial) => {
      if (Object.is(targetFace, partial.node.edge.shadow)) {
        partial.path.push([
          partial.node.proj.start,
          partial.node.proj.end,
          targetPoint
        ]);
        paths.push(partial.path);
      } else if (partial.node.children.length) {
        partial.node.children.forEach((child) => {
          const path = [...partial.path];
          path.push([
            partial.node.proj.end,
            partial.node.proj.start,
            child.proj.start,
            child.proj.end
          ]);
          partialPaths.push({ path: path, node: child });
        });
      } else {
        deadEnds.push(partial.path);
      }
    });
  }
  return [paths, deadEnds];
}

function buildRoute(
  sourcePoint,
  sourceFace,
  targetPoint,
  targetFace,
  facesNum
) {
  const [paths, deadEnds] = buildPaths(
    sourcePoint,
    sourceFace,
    targetPoint,
    targetFace,
    facesNum
  );
  const route = [];
  let currentLength = paths[0].length;
  paths.forEach((path) => {
    if (path.length < currentLength) {
      route.length = 0;
      currentLength = path.length;
      route.push(path);
    } else if (path.length === currentLength) route.push(path);
  });
  return route;
}
