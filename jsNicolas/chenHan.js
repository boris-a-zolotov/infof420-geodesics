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
  
  removeRedundant(node) {
    const keptChildren = [];
    this.children.forEach((child) => {
      let remove = false;
      node.children.forEach((otherChild) => {
        if (Object.is(otherChild.edge, child.edge) && 
            child.proj.magnitude() < otherChild.proj.magnitude())
          remove = true;
      });
      if (!remove) keptChildren.push(child);
    });
    this.children = keptChildren;
  }
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
          if (!Object.is(edge, leaf.edge.paired)) {
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


function chenHan(source, srcFace, targetFace, facesNum) {
  const tree = new ChenHanNode(source);
  const angle = new Map;
  let leaves = [];
  srcFace.edges.forEach((edge) => {
    const l = new ChenHanNode(source, edge);
    tree.addChild(l);
    leaves.push(l);
    angle.set(edge.start, new Map);
    angle.get(edge.start).set(srcFace, l)
  });
  for (let i=0; i < facesNum; ++i) {
    leaves.forEach((leaf) => {
      const shadow = leaf.edge.shadow;
      if (!targetFace || !Object.is(shadow, targetFace)) {
        const img = leaf.unfold();
        const nodes = [];
        let vertex = null;
        shadow.edges.forEach((edge) => {
          if (!Object.is(edge, leaf.edge.paired)) {
            vertex = Object.is(edge.end, leaf.edge.start) ? edge.start : edge.end;
            const proj = new Projection(img, leaf.proj, edge);
            if (!proj.empty())
              nodes.push(new ChenHanNode(img, proj, edge));
          }
        })
        if (nodes.length === 2) {
          if (!angle.has(vertex)) angle.set(vertex, new Map);
          if (!angle.get(vertex).has(shadow)) {
            angle.get(vertex).set(shadow, leaf);
            nodes.forEach((node) => leaf.addChild(node));
          } else {
            const occupant = angle.get(vertex).get(shadow);
            const dist = occupant.img.dist(vertex.p5V);
            const newDist = img.dist(vertex.p5V);
            if (newDist < dist) {
              nodes.forEach((node) => leaf.addChild(node));
              occupant.removeRedundant(leaf);
              angle.get(vertex).set(shadow, leaf);
            } else {
              nodes.forEach((node) => leaf.addChild(node));
              leaf.removeRedundant(occupant);
              if (newDist === dist)
                occupant.removeRedundant(leaf);
            }
          }
        } else if (nodes.length === 1) leaf.addChild(nodes[0]);
      }
    })
    const newLeaves = [];
    leaves.forEach((leaf) => 
      leaf.children.forEach((child) => 
        newLeaves.push(child)
      )
    );
    leaves = newLeaves;
  }
  return tree;
}

function buildPaths(
  sourcePoint,
  sourceFace,
  targetPoint,
  targetFace,
  facesNum
) {
  const tree = chenHan(sourcePoint, sourceFace, targetFace, facesNum);
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
