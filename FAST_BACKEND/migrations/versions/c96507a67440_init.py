"""init

Revision ID: c96507a67440
Revises: 
Create Date: 2022-10-02 17:35:21.037920

"""
import sqlalchemy as sa
import sqlmodel
from alembic import op


revision = "c96507a67440"
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "site",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("name", sa.String(length=255), nullable=True),
        sa.Column("status", sa.String(length=255), nullable=True),
        sa.Column("facility", sa.String(length=255), nullable=True),
        sa.Column("region", sa.String(length=255), nullable=True),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("name"),
    )

    op.create_table(
        "rack",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("name", sa.String(length=255), nullable=True),
        sa.Column("site_id", sa.Integer(), sa.ForeignKey("site.id"), nullable=True),
        sa.Column("location", sa.String(length=255), nullable=True),
        sa.Column("height", sa.String(length=255), nullable=True),
        sa.column("devices", sa.String(length=255), nullable=True),
        sa.Column("space", sa.String(length=255), nullable=True),
        sa.Column("power", sa.String(length=255), nullable=True),
        sa.Column("role", sa.String(length=255), nullable=True),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("name"),
    )

    op.create_table(
        "inventory",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("name", sa.String(length=255), nullable=True),
        sa.Column("status", sa.String(length=255), nullable=True),
        sa.Column("site_id", sa.Integer(), sa.ForeignKey("site.id"), nullable=True),
        sa.Column("rack_id", sa.Integer(), sa.ForeignKey("rack.id"), nullable=True),
        # ... (other columns)
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("name"),
    )
    op.create_table(
        "user",
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("email", sqlmodel.sql.sqltypes.AutoString(), nullable=False),
        sa.Column("password", sqlmodel.sql.sqltypes.AutoString(), nullable=False),
        sa.Column("user_token", sqlmodel.sql.sqltypes.AutoString(), nullable=False),
        sa.Column("name", sqlmodel.sql.sqltypes.AutoString(), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=False),
        sa.Column("is_superuser", sa.Boolean(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("email"),
        sa.UniqueConstraint("user_token"),
    )

    op.create_table(
        "blacklisted_token",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("token", sa.String(length=512), nullable=False),
        sa.Column("email", sa.String(length=255), nullable=True),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("token"),)

    op.create_table(
        "board_devices",
        sa.Column("id", sa.Integer(), nullable=False, primary_key=True, index=True),
        sa.Column("board_name", sa.String(), nullable=True),
        sa.Column("HW_EOS", sa.String(), nullable=True),
        sa.Column("HW_EOL", sa.String(), nullable=True),
        sa.Column("SW_EOS", sa.String(), nullable=True),
        sa.Column("SW_EOL", sa.String(), nullable=True),
        sa.Column("serial_no", sa.Integer(), nullable=True),
        sa.Column("pn_number", sa.String(), nullable=True),
        sa.Column("software_version", sa.String(), nullable=True),
        sa.Column("hardware_version", sa.String(), nullable=True),
        sa.Column("dismantle_date", sa.String(), nullable=True),
        sa.Column("status", sa.Boolean(), nullable=True),
        sa.Column("source", sa.String(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=True),
        # sa.Column("device_id", sa.Integer(), sa.ForeignKey("devices.id"), nullable=False, index=True)

        )

    op.create_table(
        "communication_room",
        sa.Column("id", sa.Integer(), nullable=False, primary_key=True, index=True),
        sa.Column("building", sa.String(), nullable=True),
        sa.Column("cr_level", sa.String(), nullable=True),
        sa.Column("cr_type", sa.String(), nullable=True),
        sa.Column("cr_number", sa.Integer(), nullable=True),
        sa.Column("adac_cr_number", sa.String(), nullable=True),
        sa.Column("sals", sa.String(), nullable=True),
        sa.Column("ad_pair", sa.String(), nullable=True),
        sa.Column("remark", sa.String(), nullable=True),
        sa.Column("entered_on", sa.DateTime(timezone=True), default=sa.func.now(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=True),
        # sa.Column("site_id", sa.Integer(), sa.ForeignKey("sites.site_id"), nullable=False, index=True)
    )

    op.create_table(
        "devices",
        sa.Column("id", sa.Integer(), nullable=False, primary_key=True, index=True),
        sa.Column("ipAddress", sa.String(), nullable=True),
        sa.Column("hostname", sa.String(), nullable=True),
        sa.Column("on_board_status", sa.Boolean(), nullable=True),
        sa.Column("sw_Type", sa.String(), nullable=True),
        sa.Column("Ru_Device", sa.String(), nullable=True),
        sa.Column("criticality", sa.String(), nullable=True),
        sa.Column("Virtual", sa.Boolean(), nullable=True),
        sa.Column("device_type", sa.String(), nullable=True),
        sa.Column("cisco_Domain", sa.String(), nullable=True),
        sa.Column("Authentication", sa.String(), nullable=True),
        sa.Column("vendor", sa.String(), nullable=True),
        sa.Column("Operation_Status", sa.Boolean(), nullable=True),
        sa.Column("Asset_Tag_Id", sa.Integer(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=True),
        # sa.Column("Rack_id", sa.Integer(), sa.ForeignKey("racks.id"), nullable=False, index=True),
        # sa.Column("site_id", sa.Integer(), sa.ForeignKey("sites.id"), nullable=False, index=True)
    )


    # ### end Alembic commands ###


def downgrade():

    op.drop_table("user")
    op.drop_table("inventory")
    op.drop_table("rack")
    op.drop_table("site")
    op.drop_table("blacklisted_token")
    op.drop_table("board_devices")
    op.drop_table("communication_room")
    op.drop_table("devices")
