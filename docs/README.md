# HyperLP Documentation

Comprehensive technical documentation for the HyperLP delta-neutral liquidity vault on Hyperliquid.

## 📚 Documentation Index

### 🏗️ Architecture & Design
- [Architecture Overview](./architecture/ARCHITECTURE.md) - System architecture and components
- [Architecture Changes](./architecture/ARCHITECTURE_CHANGES.md) - Major architectural decisions and evolution
- [Data Flow](./architecture/DATA_FLOW.md) - How data moves through the system
- [Terminology Guide](./architecture/TERMINOLOGY.md) - Business and trading terminology
- [Technical Identifiers](./architecture/TECHNICAL_IDENTIFIERS.md) - Token IDs, Spot IDs, and Asset IDs on Hyperliquid

### 🚀 Setup & Deployment
- [Database Setup](./setup/DATABASE_SETUP.md) - PostgreSQL configuration with Prisma
- [Migration Guide](./setup/MIGRATION_GUIDE.md) - Database migration procedures

### 🔧 Development
- [Multiple Databases](./development/MULTIPLE_DATABASES.md) - Multi-database architecture with separate monitoring and referrals DBs

### 💡 Features
- [LP Indexing](./features/LP_INDEXING.md) - Comprehensive guide for indexing LP positions and P&L tracking

### 🔒 Security
- [Security Policies](./security/SECURITY.md) - Security best practices and guidelines

## 🎯 Quick Start

### For Developers
1. Start with [Architecture Overview](./architecture/ARCHITECTURE.md)
2. Review [Terminology Guide](./architecture/TERMINOLOGY.md) for domain concepts
3. Check [Technical Identifiers](./architecture/TECHNICAL_IDENTIFIERS.md) for blockchain integration
4. Follow [Database Setup](./setup/DATABASE_SETUP.md) for local development

### For Contributors
1. Read [CLAUDE.md](../CLAUDE.md) for AI-assisted development guidelines
2. Review [Architecture Changes](./architecture/ARCHITECTURE_CHANGES.md) for context
3. Check [Data Flow](./architecture/DATA_FLOW.md) to understand system interactions

## 📁 Project Structure

```
docs/
├── architecture/          # System design and technical concepts
│   ├── ARCHITECTURE.md
│   ├── ARCHITECTURE_CHANGES.md
│   ├── DATA_FLOW.md
│   ├── TECHNICAL_IDENTIFIERS.md
│   └── TERMINOLOGY.md
├── development/          # Development guides and tools
│   └── MULTIPLE_DATABASES.md
├── features/             # Feature implementations
│   └── LP_INDEXING.md
├── security/             # Security documentation
│   └── SECURITY.md
├── setup/                # Installation and setup
│   ├── DATABASE_SETUP.md
│   └── MIGRATION_GUIDE.md
└── README.md            # This file
```

## 🔗 Related Resources

### Internal
- [Main Project README](../README.md) - Project overview and getting started
- [CLAUDE.md](../CLAUDE.md) - AI assistant configuration
- [Scripts Documentation](../scripts/README.md) - Utility scripts

### External
- [Hyperliquid Docs](https://hyperliquid.gitbook.io/hyperliquid-docs/)
- [HyperEVM Documentation](https://docs.hyperevm.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)

## 📝 Documentation Standards

### Adding New Documentation
1. **Location**: Place in the appropriate subdirectory
2. **Naming**: Use UPPERCASE.md for important docs, lowercase.md for guides
3. **Format**: Follow existing markdown conventions
4. **Index**: Update this README with new entries
5. **Cross-references**: Link related documents

### Document Types
- **Architecture**: System design, data flow, technical decisions
- **Setup**: Installation, configuration, deployment guides
- **Implementation**: Feature specs, integration guides
- **Security**: Security policies, vulnerability handling

## 🚧 Upcoming Documentation
- Smart contract integration guide
- Rebalancer bot implementation
- API documentation
- Performance optimization guide
- Monitoring and alerting setup