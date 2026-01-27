/**
 * League Model
 * Represents a betting league/group where friends can compete
 */
class League {
  /**
   * @param {string} id - Unique identifier for the league
   * @param {string} name - League name
   * @param {string} creatorId - ID of the user who created the league
   * @param {string} code - Invite code for joining the league
   */
  constructor(id, name, creatorId, code = '') {
    this.id = id;
    this.name = name;
    this.creatorId = creatorId;
    this.code = code || this.generateCode();
    this.members = [creatorId];
    this.createdAt = new Date();
    this.settings = {
      pointsForCorrectWinner: 1,
      pointsForWrongGuess: 0,
      allowLateJoin: true,
      isPublic: false
    };
  }

  /**
   * Generate a random invite code
   * @returns {string} 6-character invite code
   */
  generateCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  /**
   * Add a member to the league
   * @param {string} userId - ID of the user to add
   * @returns {boolean} Success status
   */
  addMember(userId) {
    if (this.members.includes(userId)) {
      return false;
    }
    this.members.push(userId);
    return true;
  }

  /**
   * Remove a member from the league
   * @param {string} userId - ID of the user to remove
   * @returns {boolean} Success status
   */
  removeMember(userId) {
    if (userId === this.creatorId) {
      return false; // Cannot remove creator
    }
    const index = this.members.indexOf(userId);
    if (index > -1) {
      this.members.splice(index, 1);
      return true;
    }
    return false;
  }

  /**
   * Check if a user is a member
   * @param {string} userId - ID of the user to check
   * @returns {boolean}
   */
  isMember(userId) {
    return this.members.includes(userId);
  }

  /**
   * Get league information
   * @returns {Object} League details
   */
  getDetails() {
    return {
      id: this.id,
      name: this.name,
      creatorId: this.creatorId,
      code: this.code,
      memberCount: this.members.length,
      members: this.members,
      createdAt: this.createdAt,
      settings: this.settings
    };
  }

  /**
   * Update league settings
   * @param {Object} newSettings - New settings to apply
   */
  updateSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
  }
}

module.exports = League;
