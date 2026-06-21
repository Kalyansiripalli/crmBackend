// Opportunity creation request validation middleware
export const validateCreateOpportunity = (req, res, next) => {
  const { customerName, requirement, estimatedValue, contactEmail, stage, priority } = req.body;
  const errors = {};

  if (!customerName || customerName.trim().length === 0) {
    errors.customerName = 'Customer/company name is required';
  }

  if (!requirement || requirement.trim().length === 0) {
    errors.requirement = 'Requirement summary is required';
  }

  if (estimatedValue !== undefined && estimatedValue !== null && estimatedValue !== '') {
    const val = Number(estimatedValue);
    if (isNaN(val) || val < 0) {
      errors.estimatedValue = 'Estimated deal value must be non-negative';
    }
  }

  if (contactEmail && contactEmail.trim().length > 0) {
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(contactEmail)) {
      errors.contactEmail = 'Please provide a valid contact email address';
    }
  }

  const validStages = ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost'];
  if (stage && !validStages.includes(stage)) {
    errors.stage = 'Invalid stage value';
  }

  const validPriorities = ['Low', 'Medium', 'High'];
  if (priority && !validPriorities.includes(priority)) {
    errors.priority = 'Invalid priority value';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      message: 'Validation failed',
      errors,
    });
  }

  next();
};

// Opportunity update request validation middleware
export const validateUpdateOpportunity = (req, res, next) => {
  const { customerName, requirement, estimatedValue, contactEmail, stage, priority } = req.body;
  const errors = {};

  if (customerName !== undefined) {
    if (customerName === null || customerName.trim().length === 0) {
      errors.customerName = 'Customer/company name cannot be empty';
    }
  }

  if (requirement !== undefined) {
    if (requirement === null || requirement.trim().length === 0) {
      errors.requirement = 'Requirement summary cannot be empty';
    }
  }

  if (estimatedValue !== undefined && estimatedValue !== null && estimatedValue !== '') {
    const val = Number(estimatedValue);
    if (isNaN(val) || val < 0) {
      errors.estimatedValue = 'Estimated deal value must be non-negative';
    }
  }

  if (contactEmail && contactEmail.trim().length > 0) {
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(contactEmail)) {
      errors.contactEmail = 'Please provide a valid contact email address';
    }
  }

  const validStages = ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost'];
  if (stage !== undefined) {
    if (!validStages.includes(stage)) {
      errors.stage = 'Invalid stage value';
    }
  }

  const validPriorities = ['Low', 'Medium', 'High'];
  if (priority !== undefined) {
    if (!validPriorities.includes(priority)) {
      errors.priority = 'Invalid priority value';
    }
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      message: 'Validation failed',
      errors,
    });
  }

  next();
};
