import {
  Mesh,
  LineCurve3,
  Vector3,
  TubeBufferGeometry,
  TubeGeometry
} from 'three';

import {ConvexMesh, ConcaveMesh, SoftMesh} from '../../physics/index.js';

import {Component} from '../../core/Component';
import {MeshComponent} from '../../core/MeshComponent';
import {PhysicsComponent} from '../../core/PhysicsComponent';
import {SoftbodyComponent} from '../../core/SoftbodyComponent';
import {loadMaterial} from '../../utils/index';

@SoftbodyComponent
@PhysicsComponent
@MeshComponent
class Tube extends Component {
  static defaults = {
    ...Component.defaults,
    geometry: {
      path: new LineCurve3(new Vector3(0, 0, 0), new Vector3(0, 0, 1)),
      segments: 20,
      radius: 2,
      radiusSegments: 8,
      closed: false
    }
  };

  static instructions = {
    ...Component.instructions,
    geometry: [
      'path',
      'segments',
      'radius',
      'radiusSegments',
      'closed'
    ]
  };

  constructor(params = {}) {
    super(params, Tube.defaults, Tube.instructions);

    if (params.build) {
      this.build(params);
      super.wrap();
    }
  }

  build(params = {}) {
    const material = loadMaterial(params.material);

    let MeshNative;

    if (this.physics && this.params.softbody) MeshNative = SoftMesh;
    else if (this.physics && this.physics.type === 'concave') MeshNative = ConcaveMesh;
    else if (this.physics) MeshNative = ConvexMesh;
    else MeshNative = Mesh;

    return new Promise((resolve) => {
      this.native = new MeshNative(
        this.buildGeometry(params),
        material,
        this.params
      );

      resolve();
    });
  }

  buildGeometry(params = {}) {
    const GConstruct = params.buffer && !params.softbody ? TubeBufferGeometry : TubeGeometry;

    const geometry = new GConstruct(
      params.geometry.path,
      params.geometry.segments,
      params.geometry.radius,
      params.geometry.radiusSegments,
      params.geometry.closed
    );

    if (params.softbody) this.proccessSoftbodyGeometry(geometry);

    return geometry;
  }

  set g_path(val) {
    this._native.geometry = this.buildGeometry(this.updateParams({geometry: {path: val}}));
  }

  get g_path() {
    return this._native.geometry.parameters.path;
  }

  set g_segments(val) {
    this._native.geometry = this.buildGeometry(this.updateParams({geometry: {segments: val}}));
  }

  get g_segments() {
    return this._native.geometry.parameters.segments;
  }

  set g_radius(val) {
    this._native.geometry = this.buildGeometry(this.updateParams({geometry: {radius: val}}));
  }

  get g_radius() {
    return this._native.geometry.parameters.radius;
  }

  set g_radiusSegments(val) {
    this._native.geometry = this.buildGeometry(this.updateParams({geometry: {radiusSegments: val}}));
  }

  get g_radiusSegments() {
    return this._native.geometry.parameters.radiusSegments;
  }

  set g_closed(val) {
    this._native.geometry = this.buildGeometry(this.updateParams({geometry: {closed: val}}));
  }

  get g_closed() {
    return this._native.geometry.parameters.closed;
  }

  clone() {
    return new Tube({build: false}).copy(this);
  }
}

export {
  Tube
};
