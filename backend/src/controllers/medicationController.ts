import { Request, Response } from 'express';
import Medication from '../models/Medication';
import MedicationSchedule from '../models/MedicationSchedule';
import MedicationSuggestion from '../models/MedicationSuggestion';

type AuthRequest = Request;

// Get user medications
export const getUserMedications = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const medications = await Medication.find({ userId })
      .populate('doctorId', 'name specialty')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: medications
    });
  } catch (error: any) {
    console.error('Error fetching user medications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch medications',
      error: error.message
    });
  }
};

// Add medication to schedule
export const addMedicationSchedule = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const scheduleData = {
      ...req.body,
      userId
    };

    const schedule = new MedicationSchedule(scheduleData);
    await schedule.save();

    // Populate medication info
    await schedule.populate('medicationId', 'name dosage frequency');

    res.status(201).json({
      success: true,
      message: 'Medication added to schedule successfully',
      data: schedule
    });
  } catch (error: any) {
    console.error('Error adding medication to schedule:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add medication to schedule',
      error: error.message
    });
  }
};

// Update medication schedule
export const updateMedicationSchedule = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const schedule = await MedicationSchedule.findOneAndUpdate(
      { _id: id, userId },
      { ...req.body, updatedAt: new Date() },
      { new: true }
    ).populate('medicationId', 'name dosage frequency');

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Medication schedule not found'
      });
    }

    res.json({
      success: true,
      message: 'Medication schedule updated successfully',
      data: schedule
    });
  } catch (error: any) {
    console.error('Error updating medication schedule:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update medication schedule',
      error: error.message
    });
  }
};

// Get medication history
export const getMedicationHistory = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { limit = 50, page = 1 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const history = await MedicationSchedule.find({
      userId,
      status: { $in: ['taken', 'missed', 'skipped'] }
    })
    .populate('medicationId', 'name dosage frequency')
    .sort({ updatedAt: -1 })
    .limit(Number(limit))
    .skip(skip);

    const total = await MedicationSchedule.countDocuments({
      userId,
      status: { $in: ['taken', 'missed', 'skipped'] }
    });

    res.json({
      success: true,
      data: history,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error: any) {
    console.error('Error fetching medication history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch medication history',
      error: error.message
    });
  }
};

// Get today's medication schedule
export const getTodaySchedule = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const today = new Date().toISOString().split('T')[0];

    const schedules = await MedicationSchedule.find({
      userId,
      date: today,
      isActive: true
    })
    .populate('medicationId', 'name dosage frequency instructions')
    .sort({ time: 1 });

    res.json({
      success: true,
      data: schedules
    });
  } catch (error: any) {
    console.error('Error fetching today\'s medication schedule:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch today\'s medication schedule',
      error: error.message
    });
  }
};

// Mark medication as taken
export const markMedicationTaken = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const schedule = await MedicationSchedule.findOneAndUpdate(
      { _id: id, userId },
      {
        status: 'taken',
        takenAt: new Date(),
        updatedAt: new Date()
      },
      { new: true }
    ).populate('medicationId', 'name dosage frequency');

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Medication schedule not found'
      });
    }

    res.json({
      success: true,
      message: 'Medication marked as taken',
      data: schedule
    });
  } catch (error: any) {
    console.error('Error marking medication as taken:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark medication as taken',
      error: error.message
    });
  }
};

// Mark medication as missed
export const markMedicationMissed = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const schedule = await MedicationSchedule.findOneAndUpdate(
      { _id: id, userId },
      {
        status: 'missed',
        updatedAt: new Date()
      },
      { new: true }
    ).populate('medicationId', 'name dosage frequency');

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Medication schedule not found'
      });
    }

    res.json({
      success: true,
      message: 'Medication marked as missed',
      data: schedule
    });
  } catch (error: any) {
    console.error('Error marking medication as missed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark medication as missed',
      error: error.message
    });
  }
};

// Get pending medications (for quiz/initialization)
export const getPendingMedications = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Get medications that are suggested but not yet accepted
    const pendingMedications = await MedicationSuggestion.find({
      userId,
      status: 'pending'
    }).populate('doctorId', 'name specialization');

    res.json({
      success: true,
      data: pendingMedications
    });
  } catch (error: any) {
    console.error('Error fetching pending medications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pending medications',
      error: error.message
    });
  }
};

// Suggest medication (for doctor use)
export const suggestMedication = async (req: AuthRequest, res: Response) => {
  try {
    const { userId, medicationName, dosage, frequency, duration, instructions } = req.body;
    const doctorId = req.user?.id;

    if (!doctorId) {
      return res.status(401).json({ message: 'Doctor not authenticated' });
    }

    const suggestion = new MedicationSuggestion({
      userId,
      doctorId,
      medicationName,
      dosage,
      frequency,
      duration,
      instructions,
      status: 'pending'
    });

    await suggestion.save();
    await suggestion.populate('doctorId', 'name specialization');

    res.status(201).json({
      success: true,
      message: 'Medication suggestion created successfully',
      data: suggestion
    });
  } catch (error: any) {
    console.error('Error creating medication suggestion:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create medication suggestion',
      error: error.message
    });
  }
};

// Update medication status (accept/reject)
export const updateMedicationStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const suggestion = await MedicationSuggestion.findOneAndUpdate(
      { _id: id, userId },
      { 
        status,
        respondedAt: new Date()
      },
      { new: true }
    ).populate('doctorId', 'name specialization');

    if (!suggestion) {
      return res.status(404).json({
        success: false,
        message: 'Medication suggestion not found'
      });
    }

    // If accepted, add to medication schedule
    if (status === 'accepted') {
      const schedule = new MedicationSchedule({
        userId,
        medicationName: suggestion.medicationName,
        dosage: suggestion.dosage,
        frequency: suggestion.frequency,
        duration: suggestion.duration,
        source: 'doctor-suggestion',
        suggestionId: suggestion._id,
        isActive: true
      });
      await schedule.save();
    }

    res.json({
      success: true,
      message: `Medication suggestion ${status} successfully`,
      data: suggestion
    });
  } catch (error: any) {
    console.error('Error updating medication status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update medication status',
      error: error.message
    });
  }
};
