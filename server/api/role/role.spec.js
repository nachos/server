'use strict';

var Q = require('q');
var expect = require('chai').expect;
var app = require('../../app');
var request = require('supertest');
var Role = require('./role.model');
var User = require('../user/user.model');
var auth = require('../../auth/auth.service');

var clearModels = function () {
  return Role.removeQ()
    .then(function () {
      return User.removeQ();
    });
};

var createModels = function () {
  return Role.createQ({
    name: "admin",
    permissions: []
  })
    .then(function (newRole) {
      return User.create({
        name: {
          first: 'Chuck',
          last: 'Norris'
        },
        gender: 'male',
        email: 'gmail@chucknorris.com',
        roles: [
          newRole._id
        ],
        password: 'hammertime'
      })
        .then(function (newUser) {
          return Q.all([Q(newRole), Q(newUser)]);
        });
    });
};

xdescribe('/api/roles', function () {
  var user;
  var role;

  beforeEach(function (done) {
    clearModels()
      .then(function () {
        return createModels();
      })
      .spread(function (newRole, newUser) {
        role = newRole;
        user = newUser;
        done();
      })
      .catch(done);
  });

  afterEach(function (done) {
    clearModels()
      .then(function () {
        done();
      })
      .catch(done);
  });

  describe('GET /api/roles', function () {
    describe('without credentials', function () {
      it('should reject the request', function (done) {
        request(app)
          .get('/api/roles')
          .expect(401)
          .expect('Content-Type', /text\/html/)
          .end(function (err, res) {
            if (err) {
              return done(err);
            }

            expect(res.body).to.be.an('object');
            expect(res.body).to.be.empty;
            done();
          });
      });
    });

    describe('with credentials', function () {
      it('should reject the request when given wrong permissions', function (done) {
        role.permissions = ['write_roles'];
        role.saveQ()
          .then(function () {
            request(app)
              .get('/api/roles')
              .set('Authorization', 'Bearer ' + auth.signToken(user._id))
              .expect(403)
              .end(function (err, res) {
                if (err) {
                  return done(err);
                }

                expect(res.body).to.be.an('object');
                expect(res.body).to.be.empty;
                done();
              });
          })
          .catch(done);
      });

      it('should respond with JSON array when given right permissions', function (done) {
        role.permissions = ['read_roles'];
        role.saveQ()
          .then(function () {
            request(app)
              .get('/api/roles')
              .set('Authorization', 'Bearer ' + auth.signToken(user._id))
              .expect(200)
              .expect('Content-Type', /json/)
              .end(function (err, res) {
                if (err) return done(err);
                expect(res.body).to.be.an('array');
                expect(res.body.length).to.equal(1);
                done();
              });
          })
          .catch(done);
      });
    });
  });

  describe('GET /api/roles/:id', function () {
    describe('without credentials', function () {
      it('should reject the request', function (done) {
        request(app)
          .get('/api/roles/1')
          .expect(401)
          .expect('Content-Type', /text\/html/)
          .end(function (err, res) {
            if (err) {
              return done(err);
            }

            res.body.should.be.an('object');
            res.body.should.be.empty;
            done();
          });
      });
    });

    describe('with credentials', function () {
      describe('with wrong permissions', function () {
        it('should reject the request', function (done) {
          role.permissions = ['write_roles'];
          role.saveQ()
            .then(function () {
              request(app)
                .get('/api/roles/1')
                .set('Authorization', 'Bearer ' + auth.signToken(user._id))
                .expect(403)
                .end(function (err, res) {
                  if (err) {
                    return done(err);
                  }

                  expect(res.body).to.be.an('object');
                  expect(res.body).to.be.empty;
                  done();
                });
            })
            .catch(done);
        });
      });

      describe('with right permissions', function () {
        it('should reject the request with wrong id', function (done) {
          role.permissions = ['read_roles'];
          role.saveQ()
            .then(function () {
              request(app)
                .get('/api/roles/1')
                .set('Authorization', 'Bearer ' + auth.signToken(user._id))
                .expect(422)
                .end(function (err, res) {
                  if (err) {
                    return done(err);
                  }
                  expect(res.body).to.be.an('object');
                  expect(res.body).to.be.empty;
                  done();
                });
            })
            .catch(done);
        });

        it('should return the role with right id', function (done) {
          role.permissions = ['read_roles'];
          role.saveQ()
            .then(function () {
              request(app)
                .get('/api/roles/' + role._id)
                .set('Authorization', 'Bearer ' + auth.signToken(user._id))
                .expect(200)
                .expect('Content-Type', /json/)
                .end(function (err, res) {
                  if (err) return done(err);
                  expect(res.body).to.be.an('object');
                  expect(res._id).to.equal(role._id.toString());
                  expect(res.body.name).to.equal(role.name);
                  done();
                });
            })
            .catch(done);
        });
      });
    });
  });

  describe('POST /api/roles', function () {
    describe('without credentials', function () {
      it('should reject the request', function (done) {
        request(app)
          .post('/api/roles')
          .expect(401)
          .expect('Content-Type', /text\/html/)
          .end(function (err, res) {
            if (err) {
              return done(err);
            }

            expect(res.body).to.be.an('object');
            expect(res.body).to.be.empty;
            done();
          });
      });
    });

    describe('with credentials', function () {
      describe('with wrong permissions', function () {
        it('should reject the request without data', function (done) {
          role.permissions = ['read_roles'];
          role.saveQ()
            .then(function () {
              request(app)
                .post('/api/roles')
                .set('Authorization', 'Bearer ' + auth.signToken(user._id))
                .expect(403)
                .end(function (err, res) {
                  if (err) {
                    return done(err);
                  }

                  expect(res.body).to.be.an('object');
                  expect(res.body).to.be.empty;
                  done();
                });
            })
            .catch(done);
        });
      });

      describe('with right permissions', function () {
        xit('should reject the request without data', function (done) {
          role.permissions = ['write_roles'];
          role.saveQ()
            .then(function () {
              request(app)
                .post('/api/roles')
                .set('Authorization', 'Bearer ' + auth.signToken(user._id))
                .expect(500)
                .end(function (err, res) {
                  if (err) {
                    return done(err);
                  }

                  expect(res.body).to.be.an('object');
                  expect(res.body).to.be.empty;
                  done();
                });
            })
            .catch(done);
        });

        xit('should reject the request with wrong data', function (done) {
          role.permissions = ['write_roles'];
          role.saveQ()
            .then(function () {
              request(app)
                .post('/api/roles')
                .set('Authorization', 'Bearer ' + auth.signToken(user._id))
                .send({name: 'admin'})
                .expect(403)
                .end(function (err, res) {
                  if (err) {
                    return done(err);
                  }

                  expect(res.body).to.be.an('object');
                  expect(res.body).to.be.empty;
                  done();
                });
            })
            .catch(done);
        });

        xit('should reject the request with right data', function (done) {
          role.permissions = ['write_roles'];
          role.saveQ()
            .then(function () {
              request(app)
                .post('/api/roles')
                .set('Authorization', 'Bearer ' + auth.signToken(user._id))
                .send({name: 'god', permissions: []})
                .expect(403)
                .end(function (err, res) {
                  if (err) {
                    return done(err);
                  }

                  expect(res.body).to.be.an('object');
                  expect(res.body).to.be.empty;
                  done();
                });
            })
            .catch(done);
        });
      });
    });
  });

  xdescribe('PUT /api/roles/:id', function () {
    it('should respond with JSON array', function (done) {
      request(app)
        .get('/api/roles')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.body).to.be.instanceof(Array);
          done();
        });
    });
  });
  xdescribe('DELETE /api/roles/:id', function () {
    it('should respond with JSON array', function (done) {
      request(app)
        .get('/api/roles')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.body).to.be.instanceof(Array);
          done();
        });
    });
  });
});