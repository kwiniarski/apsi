/**
 * Manage routing system.
 *
 * Strategy:
 * 1. For each model found create automatic routes with following rules:
 * POST model-name -> model.create
 * PUT model-name/:id -> model.update
 * GET model-name/:id? -> model.find/findAll
 * DELETE model-name/:id -> model.delete
 *
 * 2. For each controller found create routes with following rules:
 * GET controller-name/method-name -> controllerName.methodName
 *
 * If controller has one of the methods automatically created from model
 * then it will be overwritten.
 */
