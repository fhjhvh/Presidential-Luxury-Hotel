import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import './StaffDashboard.css';

const StaffDashboard = () => {
  const { user } = useAuth();
  const { department } = useParams();

  const departmentData = {
    cleaning: {
      icon: '🧹',
      name: 'Housekeeping Department',
      color: '#4A9EFF',
      schedule: [
        { day: 'Monday', shift: '08:00 - 16:00', rooms: 'Floors 2-4', tasks: 'Deep cleaning, linen change' },
        { day: 'Tuesday', shift: '08:00 - 16:00', rooms: 'Floors 5-7', tasks: 'Standard cleaning, restocking' },
        { day: 'Wednesday', shift: '08:00 - 16:00', rooms: 'Floors 2-4', tasks: 'Standard cleaning, inspection' },
        { day: 'Thursday', shift: '08:00 - 16:00', rooms: 'Floors 8-9', tasks: 'VIP suite cleaning' },
        { day: 'Friday', shift: '08:00 - 16:00', rooms: 'Floors 5-7', tasks: 'Deep cleaning, carpet care' },
        { day: 'Saturday', shift: '10:00 - 18:00', rooms: 'All Floors', tasks: 'Weekend turnover' },
        { day: 'Sunday', shift: 'OFF', rooms: '-', tasks: 'Rest day' }
      ],
      tasks: [
        { id: 1, priority: 'high', title: 'Suite 801 - VIP Guest Arrival', status: 'pending' },
        { id: 2, priority: 'medium', title: 'Floor 5 - Routine Inspection', status: 'in-progress' },
        { id: 3, priority: 'low', title: 'Linen Inventory Check', status: 'completed' }
      ]
    },
    maintenance: {
      icon: '🔧',
      name: 'Technical Services',
      color: '#FF6B35',
      schedule: [
        { day: 'Monday', shift: '07:00 - 15:00', area: 'HVAC Systems', tasks: 'Routine maintenance, filter change' },
        { day: 'Tuesday', shift: '07:00 - 15:00', area: 'Electrical', tasks: 'Lighting inspection, repairs' },
        { day: 'Wednesday', shift: '07:00 - 15:00', area: 'Plumbing', tasks: 'Water system checks' },
        { day: 'Thursday', shift: '07:00 - 15:00', area: 'Elevators', tasks: 'Safety inspection, maintenance' },
        { day: 'Friday', shift: '07:00 - 15:00', area: 'Emergency Systems', tasks: 'Fire safety equipment check' },
        { day: 'Saturday', shift: '09:00 - 17:00', area: 'General Repairs', tasks: 'Guest room repairs' },
        { day: 'Sunday', shift: 'ON-CALL', area: 'Emergency Only', tasks: 'Emergency response' }
      ],
      tasks: [
        { id: 1, priority: 'high', title: 'Room 507 - AC Unit Malfunction', status: 'pending' },
        { id: 2, priority: 'high', title: 'Elevator B - Routine Safety Check', status: 'in-progress' },
        { id: 3, priority: 'medium', title: 'Pool Equipment Maintenance', status: 'completed' }
      ]
    },
    kitchen: {
      icon: '👨‍🍳',
      name: 'Culinary Department',
      color: '#FFB800',
      schedule: [
        { day: 'Monday', shift: '06:00 - 14:00', station: 'Breakfast Service', tasks: 'Prep and service' },
        { day: 'Tuesday', shift: '14:00 - 22:00', station: 'Dinner Service', tasks: 'Fine dining prep' },
        { day: 'Wednesday', shift: '06:00 - 14:00', station: 'Breakfast Service', tasks: 'Prep and service' },
        { day: 'Thursday', shift: '14:00 - 22:00', station: 'Dinner Service', tasks: 'Special menu preparation' },
        { day: 'Friday', shift: '14:00 - 23:00', station: 'Dinner Service', tasks: 'Weekend rush preparation' },
        { day: 'Saturday', shift: '06:00 - 14:00', station: 'Brunch Service', tasks: 'Weekend brunch service' },
        { day: 'Sunday', shift: 'OFF', station: '-', tasks: 'Rest day' }
      ],
      tasks: [
        { id: 1, priority: 'high', title: 'VIP Dinner - Suite 801 (8 PM)', status: 'pending' },
        { id: 2, priority: 'medium', title: 'Menu Update - Winter Specials', status: 'in-progress' },
        { id: 3, priority: 'low', title: 'Inventory Count - Dry Storage', status: 'completed' }
      ]
    },
    club: {
      icon: '🏋️',
      name: 'Recreation Department',
      color: '#00C853',
      schedule: [
        { day: 'Monday', shift: '06:00 - 14:00', area: 'Gym & Fitness', tasks: 'Equipment maintenance, classes' },
        { day: 'Tuesday', shift: '14:00 - 22:00', area: 'Pool & Spa', tasks: 'Water quality, guest assistance' },
        { day: 'Wednesday', shift: '06:00 - 14:00', area: 'Gym & Fitness', tasks: 'Personal training sessions' },
        { day: 'Thursday', shift: '14:00 - 22:00', area: 'Pool & Spa', tasks: 'Evening activities' },
        { day: 'Friday', shift: '06:00 - 14:00', area: 'Gym & Fitness', tasks: 'Weekend prep' },
        { day: 'Saturday', shift: '08:00 - 16:00', area: 'Pool & Spa', tasks: 'Peak hours coverage' },
        { day: 'Sunday', shift: '08:00 - 16:00', area: 'Gym & Fitness', tasks: 'Weekend classes' }
      ],
      tasks: [
        { id: 1, priority: 'high', title: 'Yoga Class - Rooftop (7 AM)', status: 'pending' },
        { id: 2, priority: 'medium', title: 'Pool Chemistry Test', status: 'in-progress' },
        { id: 3, priority: 'low', title: 'Towel Inventory', status: 'completed' }
      ]
    },
    security: {
      icon: '🛡️',
      name: 'Security Department',
      color: '#D32F2F',
      schedule: [
        { day: 'Monday', shift: '22:00 - 06:00', zone: 'Night Watch', tasks: 'Perimeter patrol, monitoring' },
        { day: 'Tuesday', shift: '22:00 - 06:00', zone: 'Night Watch', tasks: 'Access control, incident response' },
        { day: 'Wednesday', shift: '22:00 - 06:00', zone: 'Night Watch', tasks: 'Camera monitoring' },
        { day: 'Thursday', shift: '22:00 - 06:00', zone: 'Night Watch', tasks: 'VIP guest coordination' },
        { day: 'Friday', shift: '22:00 - 06:00', zone: 'Night Watch', tasks: 'Weekend security prep' },
        { day: 'Saturday', shift: '14:00 - 22:00', zone: 'Evening Shift', tasks: 'Event security' },
        { day: 'Sunday', shift: 'OFF', zone: '-', tasks: 'Rest day' }
      ],
      tasks: [
        { id: 1, priority: 'high', title: 'VIP Arrival - Suite 801', status: 'pending' },
        { id: 2, priority: 'medium', title: 'Monthly Security Audit', status: 'in-progress' },
        { id: 3, priority: 'low', title: 'Key Card System Update', status: 'completed' }
      ]
    },
    nurse: {
      icon: '⚕️',
      name: 'Medical Department',
      color: '#7B1FA2',
      schedule: [
        { day: 'Monday', shift: '08:00 - 20:00', duty: 'Day Shift', tasks: 'Guest wellness checks, first aid' },
        { day: 'Tuesday', shift: '08:00 - 20:00', duty: 'Day Shift', tasks: 'Medication management' },
        { day: 'Wednesday', shift: '08:00 - 20:00', duty: 'Day Shift', tasks: 'Health consultations' },
        { day: 'Thursday', shift: '08:00 - 20:00', duty: 'Day Shift', tasks: 'Staff health screenings' },
        { day: 'Friday', shift: '08:00 - 20:00', duty: 'Day Shift', tasks: 'Emergency preparedness' },
        { day: 'Saturday', shift: '20:00 - 08:00', duty: 'Night Shift', tasks: 'On-call coverage' },
        { day: 'Sunday', shift: '20:00 - 08:00', duty: 'Night Shift', tasks: 'Emergency response' }
      ],
      tasks: [
        { id: 1, priority: 'high', title: 'Guest Request - Room 605', status: 'pending' },
        { id: 2, priority: 'medium', title: 'Medical Supply Inventory', status: 'in-progress' },
        { id: 3, priority: 'low', title: 'Staff Wellness Check', status: 'completed' }
      ]
    }
  };

  const currentDept = departmentData[department] || departmentData.cleaning;
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  return (
    <div className="staff-dashboard">
      <motion.div
        className="staff-dashboard__header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ borderLeftColor: currentDept.color }}
      >
        <div className="staff-header__icon" style={{ color: currentDept.color }}>
          {currentDept.icon}
        </div>
        <div className="staff-header__info">
          <h1>{currentDept.name}</h1>
          <p>Staff ID: {user?.staffId || user?.id}</p>
          <p className="staff-header__shift">Today's Date: {new Date().toLocaleDateString()}</p>
        </div>
      </motion.div>

      <div className="staff-dashboard__grid">
        <motion.section
          className="dashboard-section schedule-section"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h2 className="section-title">Weekly Schedule</h2>
          <div className="schedule-table">
            {currentDept.schedule.map((entry, idx) => (
              <div
                key={idx}
                className={`schedule-row ${entry.day === today ? 'schedule-row--today' : ''}`}
                style={{ borderLeftColor: entry.day === today ? currentDept.color : 'transparent' }}
              >
                <div className="schedule-day">{entry.day}</div>
                <div className="schedule-shift">{entry.shift}</div>
                <div className="schedule-area">{entry.rooms || entry.area || entry.station || entry.zone || entry.duty}</div>
                <div className="schedule-tasks">{entry.tasks}</div>
              </div>
            ))}
          </div>
        </motion.section>

        <motion.section
          className="dashboard-section tasks-section"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="section-title">Current Tasks</h2>
          <div className="tasks-list">
            {currentDept.tasks.map((task) => (
              <div key={task.id} className={`task-card task-card--${task.priority}`}>
                <div className="task-header">
                  <span className={`task-priority priority-${task.priority}`}>
                    {task.priority.toUpperCase()}
                  </span>
                  <span className={`task-status status-${task.status}`}>
                    {task.status.replace('-', ' ').toUpperCase()}
                  </span>
                </div>
                <h3 className="task-title">{task.title}</h3>
              </div>
            ))}
          </div>
        </motion.section>

        <motion.section
          className="dashboard-section info-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="section-title">Department Information</h2>
          <div className="info-grid">
            <div className="info-card">
              <div className="info-icon">👥</div>
              <div className="info-content">
                <h4>Team Size</h4>
                <p>12 Staff Members</p>
              </div>
            </div>
            <div className="info-card">
              <div className="info-icon">📞</div>
              <div className="info-content">
                <h4>Emergency Contact</h4>
                <p>Ext: 1001</p>
              </div>
            </div>
            <div className="info-card">
              <div className="info-icon">📍</div>
              <div className="info-content">
                <h4>Department Office</h4>
                <p>Floor B1</p>
              </div>
            </div>
            <div className="info-card">
              <div className="info-icon">⏰</div>
              <div className="info-content">
                <h4>Break Time</h4>
                <p>12:00 - 13:00</p>
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default StaffDashboard;
