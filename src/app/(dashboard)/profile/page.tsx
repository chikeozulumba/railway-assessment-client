import { UserProfile } from "@clerk/nextjs";

const ProfilePage = () => (
  <UserProfile path="/profile" routing="path" />
);

export default ProfilePage;
