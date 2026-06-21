import mongoose from 'mongoose';
import Opportunity from '../models/Opportunity.js';

export const createOpportunity = async (req, res, next) => {
  try {
    const {
      customerName,
      contactName,
      contactEmail,
      contactPhone,
      requirement,
      estimatedValue,
      stage,
      priority,
      nextFollowUpDate,
      notes,
    } = req.body;


    const opportunity = await Opportunity.create({
      owner: req.user._id,
      customerName,
      contactName,
      contactEmail,
      contactPhone,
      requirement,
      estimatedValue: estimatedValue === '' || estimatedValue === null ? undefined : estimatedValue,
      stage,
      priority,
      nextFollowUpDate: nextFollowUpDate === '' || nextFollowUpDate === null ? undefined : nextFollowUpDate,
      notes,
    });

    res.status(201).json({
      ...opportunity.toObject(),
      isOwner: true,
    });
  } catch (error) {
    next(error);
  }
};


export const getOpportunities = async (req, res, next) => {
  try {
    const opportunities = await Opportunity.find({})
      .populate('owner', 'name')
      .sort({ createdAt: -1 });

    const opportunitiesWithOwnership = opportunities.map(opp => {
      const oppObj = opp.toObject();
      return {
        ...oppObj,
        isOwner: opp.owner && opp.owner._id.toString() === req.user._id.toString(),
      };
    });

    res.json(opportunitiesWithOwnership);
  } catch (error) {
    next(error);
  }
};


export const getOpportunityById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      res.status(400);
      throw new Error('Invalid opportunity ID format');
    }

    const opportunity = await Opportunity.findById(id).populate('owner', 'name');

    if (!opportunity) {
      res.status(404);
      throw new Error('Opportunity not found');
    }

    res.json({
      ...opportunity.toObject(),
      isOwner: opportunity.owner && opportunity.owner._id.toString() === req.user._id.toString(),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an opportunity
// @route   PUT /api/opportunities/:id
// @access  Private
export const updateOpportunity = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      res.status(400);
      throw new Error('Invalid opportunity ID format');
    }

    const opportunity = await Opportunity.findById(id);

    if (!opportunity) {
      res.status(404);
      throw new Error('Opportunity not found');
    }

    // Check ownership
    if (opportunity.owner.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to update this opportunity');
    }

    // Do NOT allow updating 'owner' or '_id' fields from body
    const updateData = { ...req.body };
    delete updateData.owner;
    delete updateData._id;

    if (updateData.estimatedValue === '' || updateData.estimatedValue === null) {
      updateData.estimatedValue = undefined;
    }
    if (updateData.nextFollowUpDate === '' || updateData.nextFollowUpDate === null) {
      updateData.nextFollowUpDate = undefined;
    }

    const updatedOpportunity = await Opportunity.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate('owner', 'name');

    res.json({
      ...updatedOpportunity.toObject(),
      isOwner: true,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an opportunity
// @route   DELETE /api/opportunities/:id
// @access  Private
export const deleteOpportunity = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      res.status(400);
      throw new Error('Invalid opportunity ID format');
    }

    const opportunity = await Opportunity.findById(id);

    if (!opportunity) {
      res.status(404);
      throw new Error('Opportunity not found');
    }

    // Check ownership
    if (opportunity.owner.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to delete this opportunity');
    }

    await opportunity.deleteOne();

    res.json({ message: 'Opportunity deleted successfully' });
  } catch (error) {
    next(error);
  }
};
