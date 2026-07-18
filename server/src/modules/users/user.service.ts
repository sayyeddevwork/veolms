import { userRepository } from "./user.repository.js";
import { NotFoundError } from "../../shared/errors/NotFoundError.js";
import auditService from "../audit/Audit.service.js";
import { AuditAction } from "../audit/Audit.types.js";
import { UserRole } from "../../shared/types/roles.js";
import { UpdateProfileInput } from "./user.types.js";

export const userService = {
  getById: async (id: string) => {
    const user = await userRepository.findById(id);
    if (!user) throw new NotFoundError("User not found");
    return user;
  },

  listAll: async () => {
    return userRepository.findAll();
  },

  updateProfile: async (id: string, input: UpdateProfileInput) => {
    const existing = await userRepository.findById(id);
    if (!existing) throw new NotFoundError("User not found");
    return userRepository.updateProfile(id, input);
  },

  changeRole: async (
    userId: string,
    newRole: UserRole,
    actorId: string,
    ip?: string,
  ) => {
    const existing = await userRepository.findById(userId);
    if (!existing) throw new NotFoundError("User not found");

    const user = await userRepository.updateRole(userId, newRole);

    await auditService.recordAuditLog({
      actorId,
      action: AuditAction.COURSE_CREATED,
      targetId: userId,
      metadata: { previousRole: existing.role, newRole },
      ip,
    });

    return user;
  },
};
