import * as featureService from '../services/featureService.js';

export const createFeature = async (req, res, next) => {
  try {
    const feature = await featureService.createFeature(req.body);
    res.status(201).json(feature);
  } catch (error) {
    next(error);
  }
};

export const getAllFeatures = async (req, res, next) => {
  try {
    const features = await featureService.getAllFeatures(req.query);
    res.json(features);
  } catch (error) {
    next(error);
  }
};

export const getFeatureById = async (req, res, next) => {
  try {
    const feature = await featureService.getFeatureById(req.params.id);
    if (!feature) {
      return res.status(404).json({ error: 'Feature not found' });
    }
    res.json(feature);
  } catch (error) {
    next(error);
  }
};

export const updateFeature = async (req, res, next) => {
  try {
    const feature = await featureService.updateFeature(req.params.id, req.body);
    res.json(feature);
  } catch (error) {
    next(error);
  }
};

export const deleteFeature = async (req, res, next) => {
  try {
    await featureService.deleteFeature(req.params.id);
    res.json({ message: 'Feature deleted successfully' });
  } catch (error) {
    next(error);
  }
};
